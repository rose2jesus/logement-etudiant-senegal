import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentStatus, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';

const PROMOTION_PRICE_PER_DAY = 1000;
const WAVE_TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 min, conforme à la doc Wave (protection anti-rejeu)

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createPromotionOrder(ownerId: string, propertyId: string, dto: CreatePaymentOrderDto) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, ownerId },
      select: { id: true, title: true, status: true, expiresAt: true },
    });
    if (!property) throw new NotFoundException('Annonce introuvable');
    if (property.status !== PropertyStatus.approved) {
      throw new BadRequestException('Seule une annonce approuvée peut être sponsorisée');
    }
    if (property.expiresAt && property.expiresAt <= new Date()) {
      throw new BadRequestException('Cette annonce est expirée');
    }

    const amount = dto.promotionDays * PROMOTION_PRICE_PER_DAY;
    const order = await this.prisma.paymentOrder.create({
      data: { ownerId, propertyId, provider: dto.provider, promotionDays: dto.promotionDays, amount },
    });

    let checkoutUrl: string | null = null;
    let providerReference = order.id;

    if (dto.provider === 'wave') {
      const session = await this.createWaveCheckoutSession(order.id, amount);
      if (session) {
        checkoutUrl = session.wave_launch_url;
        providerReference = session.id;
      }
    } else if (dto.provider === 'orange_money') {
      const invoice = await this.createPaydunyaInvoice(order.id, amount, property.title);
      if (invoice) {
        checkoutUrl = invoice.response_text;
        providerReference = invoice.token;
      }
    }

    await this.prisma.paymentOrder.update({ where: { id: order.id }, data: { providerReference } });

    return {
      orderId: order.id,
      provider: order.provider,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      promotionDays: order.promotionDays,
      checkoutUrl,
      demoMode: !checkoutUrl,
      message: checkoutUrl
        ? 'Redirige le propriétaire vers checkoutUrl pour finaliser le paiement.'
        : "Mode démo : aucun compte marchand configuré (ou l'appel API a échoué, voir logs serveur). Utilise POST /payments/:orderId/simulate pour tester le webhook sans vraie transaction.",
    };
  }

  /**
   * Crée une vraie session de paiement Wave (POST /v1/checkout/sessions).
   * Documentation officielle : https://docs.wave.com/checkout
   * L'annonce est mise en avant uniquement quand le webhook confirme le paiement — cet appel
   * se contente d'ouvrir la session, il ne débite jamais le client tout seul.
   */
  private async createWaveCheckoutSession(orderId: string, amount: number) {
    const apiKey = this.config.get<string>('WAVE_API_KEY');
    if (!apiKey) return null;

    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3002');
    try {
      const res = await fetch('https://api.wave.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: String(amount), // Wave exige un montant en string, XOF sans décimales
          currency: 'XOF',
          client_reference: orderId,
          success_url: `${frontendUrl}/proprietaire/dashboard?promotion=success`,
          error_url: `${frontendUrl}/proprietaire/dashboard?promotion=error`,
        }),
      });
      if (!res.ok) {
        this.logger.error(`Échec création session Wave: ${res.status} ${await res.text()}`);
        return null;
      }
      const session = await res.json();
      return { id: session.id as string, wave_launch_url: session.wave_launch_url as string };
    } catch (err) {
      this.logger.error('Erreur réseau lors de la création de la session Wave', err as Error);
      return null;
    }
  }

  /**
   * Crée une facture PayDunya (agrégateur sénégalais couvrant Orange Money, Wave, Free Money
   * et cartes en une seule API — plus réaliste qu'une intégration directe avec Orange, qui n'a
   * pas d'API self-service publique). Doc : https://developers.paydunya.com/doc/FR/checkout-invoice
   */
  private async createPaydunyaInvoice(orderId: string, amount: number, propertyTitle: string) {
    const masterKey = this.config.get<string>('PAYDUNYA_MASTER_KEY');
    const privateKey = this.config.get<string>('PAYDUNYA_PRIVATE_KEY');
    const token = this.config.get<string>('PAYDUNYA_TOKEN');
    if (!masterKey || !privateKey || !token) return null;

    const baseUrl =
      this.config.get<string>('PAYDUNYA_MODE') === 'live'
        ? 'https://app.paydunya.com/api/v1'
        : 'https://app.paydunya.com/sandbox-api/v1';

    try {
      const res = await fetch(`${baseUrl}/checkout-invoice/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYDUNYA-MASTER-KEY': masterKey,
          'PAYDUNYA-PRIVATE-KEY': privateKey,
          'PAYDUNYA-TOKEN': token,
        },
        body: JSON.stringify({
          invoice: {
            total_amount: amount,
            description: `Mise en avant — ${propertyTitle}`,
          },
          store: { name: 'Logement Étudiant Sénégal' },
          custom_data: { order_id: orderId },
        }),
      });
      const data = await res.json();
      if (data.response_code !== '00') {
        this.logger.error(`Échec création facture PayDunya: ${JSON.stringify(data)}`);
        return null;
      }
      return { token: data.token as string, response_text: data.response_text as string };
    } catch (err) {
      this.logger.error('Erreur réseau lors de la création de la facture PayDunya', err as Error);
      return null;
    }
  }

  findMine(ownerId: string) {
    return this.prisma.paymentOrder.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });
  }

  /**
   * Vérifie la signature Wave conformément à la documentation officielle :
   * header "Wave-Signature: t={timestamp},v1={hmac}" (peut contenir plusieurs v1= pendant une
   * rotation de clé — on accepte si l'un d'eux correspond).
   */
  verifyWaveSignature(signatureHeader: string | undefined, rawBody: Buffer): void {
    const secret = this.config.get<string>('WAVE_WEBHOOK_SECRET');
    if (!secret) throw new UnauthorizedException('WAVE_WEBHOOK_SECRET non configuré côté serveur');
    if (!signatureHeader) throw new UnauthorizedException('En-tête Wave-Signature manquant');

    const parts = signatureHeader.split(',');
    const timestamp = parts.find((p) => p.startsWith('t='))?.split('=')[1];
    const signatures = parts.filter((p) => p.startsWith('v1=')).map((p) => p.split('=')[1]);
    if (!timestamp || signatures.length === 0) {
      throw new UnauthorizedException('Format Wave-Signature invalide');
    }

    const age = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (age > WAVE_TIMESTAMP_TOLERANCE_SECONDS) {
      throw new UnauthorizedException('Timestamp du webhook hors fenêtre de tolérance (rejeu possible)');
    }

    const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
    const computedSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    const computedBuf = Buffer.from(computedSig, 'utf8');

    const valid = signatures.some((sig) => {
      const sigBuf = Buffer.from(sig, 'utf8');
      return sigBuf.length === computedBuf.length && crypto.timingSafeEqual(sigBuf, computedBuf);
    });
    if (!valid) throw new UnauthorizedException('Signature Wave invalide');
  }

  async handleWaveEvent(payload: any) {
    if (payload?.type !== 'checkout.session.completed') {
      this.logger.log(`Événement Wave ignoré: ${payload?.type}`);
      return { received: true, handled: false };
    }
    const orderReference = payload?.data?.client_reference ?? payload?.data?.id;
    if (!orderReference) {
      this.logger.warn('Événement Wave sans référence de commande exploitable');
      return { received: true, handled: false };
    }
    await this.confirmPayment(orderReference, 'wave');
    return { received: true, handled: true };
  }

  /**
   * PayDunya envoie une notification IPN puis recommande de revérifier l'état réel de la facture
   * auprès de leur API plutôt que de faire confiance au corps de la requête — c'est le pattern de
   * sécurité qu'ils documentent eux-mêmes. On extrait le token reçu, puis on interroge PayDunya
   * pour confirmer avant de créditer quoi que ce soit.
   * ⚠️ Le nom exact des champs du corps de l'IPN doit être vérifié une fois un compte sandbox réel
   * obtenu (non confirmable sans y avoir accès) — cette extraction couvre les formats les plus
   * courants observés dans leurs exemples d'intégration.
   */
  async handleOrangeMoneyEvent(rawBody: string) {
    let token: string | undefined;
    try {
      const parsed = JSON.parse(rawBody);
      token = parsed.token ?? parsed?.data?.invoice?.token ?? parsed?.data?.token;
    } catch {
      const params = new URLSearchParams(rawBody);
      token = params.get('token') ?? undefined;
      const dataField = params.get('data');
      if (!token && dataField) {
        try {
          token = JSON.parse(dataField)?.invoice?.token;
        } catch {
          /* ignore */
        }
      }
    }

    if (!token) {
      this.logger.warn('Notification PayDunya sans token de facture exploitable');
      return { received: true, handled: false };
    }

    const confirmed = await this.confirmPaydunyaInvoice(token);
    if (!confirmed) return { received: true, handled: false };

    await this.confirmPayment(token, 'orange_money');
    return { received: true, handled: true };
  }

  private async confirmPaydunyaInvoice(token: string): Promise<boolean> {
    const masterKey = this.config.get<string>('PAYDUNYA_MASTER_KEY');
    const privateKey = this.config.get<string>('PAYDUNYA_PRIVATE_KEY');
    const apiToken = this.config.get<string>('PAYDUNYA_TOKEN');
    if (!masterKey || !privateKey || !apiToken) return false;

    const baseUrl =
      this.config.get<string>('PAYDUNYA_MODE') === 'live'
        ? 'https://app.paydunya.com/api/v1'
        : 'https://app.paydunya.com/sandbox-api/v1';

    try {
      const res = await fetch(`${baseUrl}/checkout-invoice/confirm/${token}`, {
        headers: {
          'PAYDUNYA-MASTER-KEY': masterKey,
          'PAYDUNYA-PRIVATE-KEY': privateKey,
          'PAYDUNYA-TOKEN': apiToken,
        },
      });
      const data = await res.json();
      return data.status === 'completed';
    } catch (err) {
      this.logger.error('Erreur lors de la confirmation de la facture PayDunya', err as Error);
      return false;
    }
  }

  /**
   * Confirme un paiement : marque la commande payée et prolonge (ou démarre) la mise en avant
   * de l'annonce concernée. C'est le seul endroit qui a un effet réel sur la visibilité —
   * sans cet appel, une commande créée ne change jamais rien à l'annonce.
   */
  private async confirmPayment(orderReference: string, expectedProvider: 'wave' | 'orange_money') {
    const order = await this.prisma.paymentOrder.findFirst({
      where: { OR: [{ id: orderReference }, { providerReference: orderReference }] },
    });
    if (!order) {
      this.logger.warn(`Commande introuvable pour la référence ${orderReference}`);
      return;
    }
    if (order.provider !== expectedProvider) {
      this.logger.warn(`Fournisseur incohérent pour la commande ${order.id}`);
      return;
    }
    if (order.status === PaymentStatus.paid) {
      return; // déjà traité — idempotence (les webhooks peuvent renvoyer le même événement)
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.paymentOrder.update({
        where: { id: order.id },
        data: { status: PaymentStatus.paid, paidAt: new Date(), providerReference: orderReference },
      });

      const property = await tx.property.findUnique({
        where: { id: order.propertyId },
        select: { promotedUntil: true },
      });
      const base = property?.promotedUntil && property.promotedUntil > new Date() ? property.promotedUntil : new Date();
      const promotedUntil = new Date(base.getTime() + order.promotionDays * 24 * 60 * 60 * 1000);

      await tx.property.update({ where: { id: order.propertyId }, data: { promotedUntil } });
    });

    this.logger.log(`Paiement confirmé pour la commande ${order.id}, annonce ${order.propertyId} mise en avant`);
  }

  /**
   * Endpoint de secours pour tester tout le flux (webhook -> mise en avant) sans compte marchand
   * réel. Clairement marqué comme outil de démo — jamais exposé en dehors du réservataire de la
   * commande, et devra être retiré ou protégé avant un vrai lancement commercial.
   */
  async simulatePayment(ownerId: string, orderId: string) {
    const order = await this.prisma.paymentOrder.findFirst({ where: { id: orderId, ownerId } });
    if (!order) throw new NotFoundException('Commande introuvable');
    await this.confirmPayment(order.id, order.provider as 'wave' | 'orange_money');
    return { simulated: true, orderId };
  }
}
