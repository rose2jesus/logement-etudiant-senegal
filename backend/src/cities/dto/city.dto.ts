import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
