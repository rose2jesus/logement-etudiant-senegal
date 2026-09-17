import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Utilisation : @UseGuards(JwtAuthGuard) sur un contrôleur ou une route
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
