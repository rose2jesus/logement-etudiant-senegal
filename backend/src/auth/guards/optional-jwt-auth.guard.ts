import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Comme JwtAuthGuard, mais ne bloque jamais la requête : si le token est absent
// ou invalide, req.user reste simplement undefined au lieu de renvoyer 401.
// Utile pour les routes publiques qui ont un comportement légèrement différent
// pour un utilisateur connecté (ex: voir sa propre annonce en attente de modération).
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user || null;
  }
}
