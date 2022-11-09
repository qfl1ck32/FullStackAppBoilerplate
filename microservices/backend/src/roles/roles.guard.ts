import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GQLContext } from '@root/graphql/defs';
import { PermissionsService } from '@root/permissions/permissions.service';

import { UserNotAuthorizedException } from './exceptions/UserNotAuthorized.exception';

import { ROLES_KEY } from './roles.decorator';
import { Domain, Role } from './roles.enum';
import { Observable } from 'rxjs';

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

    // TODO: type for getContext() return
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();

    const request = gqlContext.req;

    const { jwt } = request;

    if (requiredRoles?.length) {
      if (!jwt) {
        throw new UserNotAuthorizedException();
      }

      if (jwt.error) {
        throw jwt.error;
      }
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
