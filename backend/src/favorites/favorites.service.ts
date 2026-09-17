import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  findMine(studentId: string) {
    return this.prisma.favorite.findMany({
      where: { studentId },
      include: {
        property: { include: { images: { take: 1 }, city: true, neighborhood: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // upsert-like : ajoute si absent, ignore si déjà présent (idempotent, simple pour le bouton cœur)
  async add(studentId: string, propertyId: string) {
    return this.prisma.favorite.upsert({
      where: { studentId_propertyId: { studentId, propertyId } },
      create: { studentId, propertyId },
      update: {},
    });
  }

  async remove(studentId: string, propertyId: string) {
    await this.prisma.favorite.deleteMany({ where: { studentId, propertyId } });
    return { removed: true };
  }
}
