import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsString()
  propertyId: string;

  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional() @IsString()
  description?: string;
}
