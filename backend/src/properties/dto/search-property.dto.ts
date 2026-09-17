import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PropertyType } from '@prisma/client';

export class SearchPropertyDto {
  @IsOptional() @IsString()
  cityId?: string;

  @IsOptional() @IsString()
  neighborhoodId?: string;

  @IsOptional() @IsString()
  institutionId?: string;

  @IsOptional() @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional() @Type(() => Number) @IsInt()
  minPrice?: number;

  @IsOptional() @Type(() => Number) @IsInt()
  maxPrice?: number;

  @IsOptional() @Type(() => Boolean) @IsBoolean()
  furnished?: boolean;

  @IsOptional() @IsString()
  sort?: 'price_asc' | 'price_desc' | 'recent';

  @IsOptional() @Type(() => Number) @IsInt()
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt()
  pageSize?: number = 12;
}
