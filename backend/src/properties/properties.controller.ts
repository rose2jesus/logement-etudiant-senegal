import {
  Body,
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { ModeratePropertyDto } from './dto/moderate-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

interface RequestUser {
  userId: string;
  email: string;
  role: string;
}

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.owner)
  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(user.userId, dto);
  }

  @Get()
  search(@Query() query: SearchPropertyDto) {
    return this.propertiesService.search(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.owner)
  @Get('mine')
  findMine(@CurrentUser() user: RequestUser) {
    return this.propertiesService.findMine(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Get('pending')
  findPending() {
    return this.propertiesService.findPendingForModeration();
  }

  // Guard "optionnel" : la route reste publique, mais si un token est fourni,
  // on récupère l'utilisateur pour autoriser un propriétaire/admin à voir sa propre annonce pending.
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Req() req: any) {
    return this.propertiesService.findBySlug(slug, req.user?.userId, req.user?.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Patch(':id/moderate')
  moderate(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: ModeratePropertyDto,
  ) {
    return this.propertiesService.moderate(id, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.propertiesService.remove(id, user.userId, user.role);
  }
}
