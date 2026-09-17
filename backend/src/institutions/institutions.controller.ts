import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('institutions')
export class InstitutionsController {
  constructor(private institutionsService: InstitutionsService) {}

  @Get()
  findAll(@Query('cityId') cityId?: string) {
    return this.institutionsService.findAll(cityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post()
  create(
    @Body() body: { name: string; cityId: string; type?: string; latitude?: number; longitude?: number },
  ) {
    return this.institutionsService.create(body);
  }
}
