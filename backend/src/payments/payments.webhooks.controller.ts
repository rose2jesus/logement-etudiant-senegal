import { Controller, Post, Req, HttpCode } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';

// Route publique : appelée par les serveurs de PayDunya, pas par le navigateur.
// La sécurité repose sur la re-vérification de l'état de la facture directement auprès de
// PayDunya (voir handlePaydunyaEvent), pas sur une vérification de signature du corps reçu.
@Controller('payments/webhooks')
export class PaymentsWebhooksController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('paydunya')
  @HttpCode(200)
  async paydunya(@Req() req: RawBodyRequest<Request>) {
    const rawBody = (req.rawBody as Buffer).toString('utf8');
    return this.paymentsService.handlePaydunyaEvent(rawBody);
  }
}
