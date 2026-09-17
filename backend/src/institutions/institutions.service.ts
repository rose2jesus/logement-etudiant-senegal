import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  findAll(cityId?: string) {
    return this.prisma.institution.findMany({
      where: cityId ? { cityId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  create(data: { name: string; cityId: string; type?: string; latitude?: number; longitude?: number }) {
    return this.prisma.institution.create({ data });
  }
}
