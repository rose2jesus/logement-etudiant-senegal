import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';

const PROMOTION_PRICE_PER_DAY = 1000;

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
      data: { ownerId, propertyId, provider: 'paydunya', promotionDays: dto.promotionDays, amount },
    });

    const invoice = await this.createPaydunyaInvoice(order.id, amount, property.title);
    const checkoutUrl = invoice?.response_text ?? null;
    const providerReference = invoice?.token ?? order.id;

    await this.prisma.paymentOrder.update({ where: { id: order.id }, data: { providerReference } });

    return {
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      promotionDays: order.promotionDays,
      checkoutUrl,
      demoMode: !checkoutUrl,
      message: checkoutUrl
        ? 'Redirige le propriétaire vers checkoutUrl — il pourra choisir Wave, Orange Money ou Free Money sur la page PayDunya.'
        : "Mode démo : compte PayDunya pas encore configuré (ou l'appel API a échoué, voir logs serveur). Utilise POST /payments/:orderId/simulate pour tester le webhook sans vraie transaction.",
    };
  }

  /**
   * Crée une facture PayDunya (agrégateur sénégalais couvrant Orange Money, Wave, Free Money et
   * cartes en une seule API). Le payeur choisit son moyen de paiement sur la page hébergée par
   * PayDunya elle-même — on n'a pas besoin de lui demander à l'avance dans notre interface.
   * Doc : https://developers.paydunya.com/doc/FR/checkout-invoice
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
   * PayDunya envoie une notification IPN puis recommande de revérifier l'état réel de la facture
   * auprès de leur API plutôt que de faire confiance au corps de la requête — c'est le pattern de
   * sécurité qu'ils documentent eux-mêmes.
   * ⚠️ Le nom exact des champs du corps de l'IPN doit être vérifié une fois un compte sandbox réel
   * obtenu — cette extraction couvre les formats les plus courants observés dans leurs exemples.
   */
  async handlePaydunyaEvent(rawBody: string) {
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

    await this.confirmPayment(token);
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
  private async confirmPayment(orderReference: string) {
    const order = await this.prisma.paymentOrder.findFirst({
      where: { OR: [{ id: orderReference }, { providerReference: orderReference }] },
    });
    if (!order) {
      this.logger.warn(`Commande introuvable pour la référence ${orderReference}`);
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
   * Endpoint de secours pour tester tout le flux (webhook -> mise en avant) sans compte PayDunya
   * réel. Clairement marqué comme outil de démo — à retirer ou protéger avant un vrai lancement.
   */
  async simulatePayment(ownerId: string, orderId: string) {
    const order = await this.prisma.paymentOrder.findFirst({ where: { id: orderId, ownerId } });
    if (!order) throw new NotFoundException('Commande introuvable');
    await this.confirmPayment(order.id);
    return { simulated: true, orderId };
  }
}
