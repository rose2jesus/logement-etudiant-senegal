import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReportDto, reporterId?: string) {
    const property = await this.prisma.property.findUnique({ where: { id: dto.propertyId } });
    if (!property) throw new NotFoundException('Annonce introuvable');
    return this.prisma.report.create({ data: { ...dto, reporterId } });
  }

  findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, title: true, slug: true } },
        reporter: { select: { email: true } },
      },
    });
  }

  updateStatus(id: string, status: ReportStatus) {
    return this.prisma.report.update({ where: { id }, data: { status } });
  }
}
