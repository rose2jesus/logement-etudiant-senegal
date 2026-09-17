import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

interface RequestUser { userId: string; role: string; }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.student)
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  findMine(@CurrentUser() user: RequestUser) {
    return this.favoritesService.findMine(user.userId);
  }

  @Post(':propertyId')
  add(@CurrentUser() user: RequestUser, @Param('propertyId') propertyId: string) {
    return this.favoritesService.add(user.userId, propertyId);
  }

  @Delete(':propertyId')
  remove(@CurrentUser() user: RequestUser, @Param('propertyId') propertyId: string) {
    return this.favoritesService.remove(user.userId, propertyId);
  }
}
