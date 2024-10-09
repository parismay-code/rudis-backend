import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/auth/role-auth.decorator';
import { validate } from './auth.helpers';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoleNames = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoleNames) {
        return true;
      }

      const requiredRoles = await this.rolesService.getRolesWhereName(
        Array.from(requiredRoleNames),
      );

      const requiredRolePriorities = requiredRoles.map((role) => role.priority);

      const minimalRolePriority = Math.min(...requiredRolePriorities);

      const req = context.switchToHttp().getRequest();

      const user = validate(req, this.jwtService);

      const hasRole = user.roles.some((role) =>
        requiredRoleNames.includes(role.name),
      );

      const morePriority = user.roles.some(
        (role) => role.priority >= minimalRolePriority,
      );

      return hasRole || morePriority;
    } catch {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }
  }
}
