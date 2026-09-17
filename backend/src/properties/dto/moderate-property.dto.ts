import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PropertyStatus } from '@prisma/client';

export class ModeratePropertyDto {
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @IsOptional() @IsString()
  rejectionReason?: string;
}
