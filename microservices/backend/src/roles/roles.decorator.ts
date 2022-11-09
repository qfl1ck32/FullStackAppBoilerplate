import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { Role } from './roles.enum';
import { RolesGuard } from './roles.guard';

export const ROLES_KEY = 'roles';

export const RequireRoles = (role: Role | Role[]) => {
  const roles = Array.isArray(role) ? role : [role];

  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};
