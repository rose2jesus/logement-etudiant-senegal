import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(90)
  promotionDays: number;
}
