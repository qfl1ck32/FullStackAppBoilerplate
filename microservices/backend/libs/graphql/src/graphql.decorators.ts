import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Context } from '@nestjs/graphql';

import { Role } from '@app/permissions/defs';

import { ROLES_KEY } from './defs';
import { RolesGuard } from './roles/roles.guard';

export const RequireRoles = (role: Role | Role[]) => {
  const roles = Array.isArray(role) ? role : [role];

  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};

export const UserId = () => Context('userId');
