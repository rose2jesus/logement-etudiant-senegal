import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface RequestUser { userId: string; }

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.owner)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('properties/:propertyId/promotion')
  createPromotionOrder(
    @CurrentUser() user: RequestUser,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreatePaymentOrderDto,
  ) {
    return this.paymentsService.createPromotionOrder(user.userId, propertyId, dto);
  }

  @Get('mine')
  findMine(@CurrentUser() user: RequestUser) {
    return this.paymentsService.findMine(user.userId);
  }

  // Outil de démo/développement : simule la confirmation d'un paiement pour tester le flux complet
  // (commande -> paiement -> mise en avant de l'annonce) sans compte marchand Wave/Orange Money réel.
  @Post(':orderId/simulate')
  simulate(@CurrentUser() user: RequestUser, @Param('orderId') orderId: string) {
    return this.paymentsService.simulatePayment(user.userId, orderId);
  }
}
