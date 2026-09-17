import { Module } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestsController } from './contact-requests.controller';

@Module({
  providers: [ContactRequestsService],
  controllers: [ContactRequestsController],
})
export class ContactRequestsModule {}
