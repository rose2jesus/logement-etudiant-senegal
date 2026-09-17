import { Controller, Post, Req, Headers, HttpCode } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';

// Routes publiques : appelées par les serveurs de Wave / PayDunya, pas par le navigateur.
// La sécurité repose sur la vérification de signature (Wave) ou la re-vérification côté
// serveur (PayDunya), pas sur un JWT.
@Controller('payments/webhooks')
export class PaymentsWebhooksController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('wave')
  @HttpCode(200)
  async wave(@Req() req: RawBodyRequest<Request>, @Headers('wave-signature') signature: string) {
    this.paymentsService.verifyWaveSignature(signature, req.rawBody as Buffer);
    const payload = JSON.parse((req.rawBody as Buffer).toString('utf8'));
    return this.paymentsService.handleWaveEvent(payload);
  }

  // Notification PayDunya pour Orange Money (et Wave/Free Money si utilisés via cet agrégateur).
  @Post('orange-money')
  @HttpCode(200)
  async orangeMoney(@Req() req: RawBodyRequest<Request>) {
    const rawBody = (req.rawBody as Buffer).toString('utf8');
    return this.paymentsService.handleOrangeMoneyEvent(rawBody);
  }
}
