import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Vérifie qu'aucun compte n'existe déjà avec cet email ou ce téléphone
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email ou ce téléphone');
    }

    if (dto.role === UserRole.student && (!dto.institutionId || !dto.cityId)) {
      throw new BadRequestException('Établissement et ville requis pour un compte étudiant');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Création de l'utilisateur + du profil spécifique (student ou owner) en une transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          role: dto.role,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          passwordHash,
        },
      });

      if (dto.role === UserRole.student) {
        await tx.student.create({
          data: {
            userId: createdUser.id,
            institutionId: dto.institutionId,
            cityId: dto.cityId,
          },
        });
      } else if (dto.role === UserRole.owner) {
        await tx.owner.create({
          data: {
            userId: createdUser.id,
            ownerType: dto.ownerType ?? 'particulier',
          },
        });
      }

      return createdUser;
    });

    return this.buildAuthResponse(user.id, user.email, user.role, user.firstName);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }

    return this.buildAuthResponse(user.id, user.email, user.role, user.firstName);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        student: { include: { institution: true, city: true } },
        owner: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  private buildAuthResponse(userId: string, email: string, role: UserRole, firstName: string) {
    const accessToken = this.jwt.sign({ sub: userId, email, role });
    return {
      accessToken,
      user: { id: userId, email, role, firstName },
    };
  }
}
