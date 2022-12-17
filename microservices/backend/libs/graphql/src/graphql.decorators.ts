import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Args as BaseArgs, Context } from '@nestjs/graphql';

import { Decorator } from '@app/core/defs';
import { Role } from '@app/permissions/defs';

import { ROLES_KEY } from './defs';
import { RolesGuard } from './roles/roles.guard';

export const RequireRoles = (role: Role | Role[]) => {
  const roles = Array.isArray(role) ? role : [role];

  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};

export const GetInput = () => {
  const decorator: ParameterDecorator = (
    target,
    propertyKey,
    parameterIndex,
  ) => {
    BaseArgs({
      name: 'input',
    })(target, propertyKey, parameterIndex);

    return target;
  };

  return applyDecorators(decorator as any) as ParameterDecorator;
};

export const GetUserId = () => Context('userId');
export const GetLanguage = () => Context('language');
