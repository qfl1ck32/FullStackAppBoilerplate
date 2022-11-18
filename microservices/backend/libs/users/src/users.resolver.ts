import { ResolveField, Resolver } from '@nestjs/graphql';

import { PermissionsService } from '@app/permissions';
import { Role } from '@app/permissions/defs';

import { User } from './users';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ResolveField(() => [Role])
  async roles(parent: User) {
    const { _id: userId } = parent;

    return this.permissionsService.find({ userId });
  }
}
