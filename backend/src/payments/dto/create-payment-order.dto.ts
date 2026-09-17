import { IsEnum, IsInt, IsPositive, Max, Min } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class CreatePaymentOrderDto {
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(90)
  promotionDays: number;
}
