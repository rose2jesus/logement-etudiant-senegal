import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';

@Injectable()
export class ContactRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactRequestDto, studentId?: string) {
    const property = await this.prisma.property.findUnique({ where: { id: dto.propertyId } });
    if (
      !property ||
      property.status !== 'approved' ||
      (property.expiresAt !== null && property.expiresAt <= new Date())
    ) {
      throw new NotFoundException('Annonce introuvable');
    }

    return this.prisma.contactRequest.create({
      data: { ...dto, studentId },
    });
  }

  // Demandes reçues pour toutes les annonces d'un propriétaire donné
  findForOwner(ownerId: string) {
    return this.prisma.contactRequest.findMany({
      where: { property: { ownerId } },
      include: { property: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, ownerId: string) {
    const request = await this.prisma.contactRequest.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!request || request.property.ownerId !== ownerId) {
      throw new NotFoundException('Demande introuvable');
    }
    return this.prisma.contactRequest.update({ where: { id }, data: { isRead: true } });
  }
}
