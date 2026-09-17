import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsWebhooksController } from './payments.webhooks.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController, PaymentsWebhooksController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
