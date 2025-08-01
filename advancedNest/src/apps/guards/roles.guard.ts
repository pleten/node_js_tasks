import { CanActivate } from '../../core';
import { Injectable, SetMetadata } from '../../core';
import { Reflector } from '../../core';
import { ExecutionContext } from '../../core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const allowed = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!allowed || allowed.length === 0) return true;

    const { headers } = ctx.switchToHttp().getRequest();

    const role = headers['x-role'] as string;

    return !!role && allowed.includes(role);
  }
}
