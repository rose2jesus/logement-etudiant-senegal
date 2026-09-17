import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactRequestDto {
  @IsString()
  propertyId: string;

  @IsString() @MinLength(2)
  name: string;

  @IsString() @MinLength(9)
  phone: string;

  @IsOptional() @IsString()
  message?: string;

  @IsIn(['whatsapp', 'formulaire'])
  channel: 'whatsapp' | 'formulaire';
}
