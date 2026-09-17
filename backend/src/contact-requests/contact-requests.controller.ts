import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { Req } from '@nestjs/common';

interface RequestUser { userId: string; role: string; }

@Controller('contact-requests')
export class ContactRequestsController {
  constructor(private service: ContactRequestsService) {}

  // Accessible même sans compte étudiant (visiteur non connecté peut contacter)
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() dto: CreateContactRequestDto, @Req() req: any) {
    return this.service.create(dto, req.user?.role === 'student' ? req.user.userId : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.owner)
  @Get('received')
  findForOwner(@CurrentUser() user: RequestUser) {
    return this.service.findForOwner(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.owner)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.markAsRead(id, user.userId);
  }
}
