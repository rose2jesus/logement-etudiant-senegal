import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsIn([UserRole.student, UserRole.owner], {
    message: 'Le rôle doit être "student" ou "owner"',
  })
  role: UserRole;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(9, { message: 'Numéro de téléphone invalide' })
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  // Champs requis uniquement si role === 'student'
  @ValidateIf((dto) => dto.role === UserRole.student)
  @IsString()
  institutionId?: string;

  @ValidateIf((dto) => dto.role === UserRole.student)
  @IsString()
  cityId?: string;

  // Champ optionnel si role === 'owner'
  @ValidateIf((dto) => dto.role === UserRole.owner)
  @IsOptional()
  @IsString()
  ownerType?: string;
}
