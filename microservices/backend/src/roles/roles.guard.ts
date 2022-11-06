import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestJwtType } from '@root/auth/auth.middleware';
import { JWTRefreshTokenAuthPayload } from '@root/auth/types/jwt-payload.type';
import { PermissionsService } from '@root/permissions/permissions.service';
import { Observable } from 'rxjs';
import { UserNotAuthorizedException } from './exceptions/UserNotAuthorized.exception';
import { ROLES_KEY } from './roles.decorator';
import { Domain, Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const gqlContext = GqlExecutionContext.create(context).getContext();

    const request = gqlContext.req;

    const jwt = request.jwt as RequestJwtType | undefined;

    if (jwt.error && requiredRoles?.length) {
      throw jwt.error;
    }

    const { userId } = jwt.payload;

    return new Promise(async (resolve, reject) => {
      const hasPermission = await this.permissionsService.has({
        userId,
        domain: Domain.APP,
        permission: requiredRoles,
      });

      if (!hasPermission) {
        reject(new UserNotAuthorizedException());
      }

      resolve(true);
    });
  }
}
