import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PropertyStatus, ReportStatus, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalStudents,
      totalOwners,
      totalProperties,
      pendingProperties,
      approvedProperties,
      openReports,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.student } }),
      this.prisma.user.count({ where: { role: UserRole.owner } }),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: PropertyStatus.pending } }),
      this.prisma.property.count({ where: { status: PropertyStatus.approved } }),
      this.prisma.report.count({ where: { status: ReportStatus.open } }),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalOwners,
      totalProperties,
      pendingProperties,
      approvedProperties,
      openReports,
    };
  }
}
