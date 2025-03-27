import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // Si el endpoint no tiene @Roles, permite acceso
      return true;
    }

    // Obtiene el usuario (req.user) inyectado por JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();
    // user.rol viene de tu token JWT (p.ej. 'admin', 'cliente')

    // Checa si el rol del usuario está en la lista de roles permitidos
    return requiredRoles.some((role) => user.rol?.includes(role));
  }
}
