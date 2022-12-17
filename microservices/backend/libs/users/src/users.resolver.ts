import { Query, ResolveField, Resolver } from '@nestjs/graphql';

import { InjectCollection } from '@app/collections/collections.decorators';
import { PermissionsService } from '@app/permissions';
import { Role } from '@app/permissions/defs';

import { User, UsersCollection } from './users.class';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @InjectCollection(User) private readonly usersCollection: UsersCollection,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Query(() => User)
  async getUser() {
    return this.usersCollection.findOne({});
  }

  @ResolveField(() => [Role])
  async roles(parent: User) {
    const { _id: userId } = parent;

    return this.permissionsService.find({ userId });
  }
}
