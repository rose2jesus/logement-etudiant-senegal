import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { PropertyType, PricePeriod } from '@prisma/client';

export class CreatePropertyDto {
  @IsString() @MinLength(5)
  title: string;

  @IsString() @MinLength(20, { message: 'La description doit être suffisamment détaillée (20 caractères min)' })
  description: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  cityId: string;

  @IsOptional() @IsString()
  neighborhoodId?: string;

  @IsOptional() @IsString()
  institutionId?: string;

  @IsOptional() @IsInt()
  distanceKm?: number;

  @IsInt() @Min(1000, { message: 'Le prix doit être réaliste (>= 1000 FCFA)' })
  price: number;

  @IsEnum(PricePeriod)
  pricePeriod: PricePeriod;

  @IsOptional() @IsInt() @Min(0)
  deposit?: number;

  @IsBoolean()
  furnished: boolean;

  @IsInt() @Min(1)
  capacity: number;

  @IsOptional() @IsInt() @Min(1)
  minDurationMonths?: number;

  @IsOptional() @IsDateString()
  availableFrom?: string;

  // Équipements sous forme de clés activées, ex: ["wifi","eau","climatisation"]
  @IsArray() @IsOptional()
  features?: string[];

  // URLs déjà uploadées via /upload/image
  @IsArray() @MinLength(1, { each: true })
  images: string[];
}
