import { Query, ResolveField, Resolver } from '@nestjs/graphql';

import { PermissionsService } from '@app/permissions';
import { Role } from '@app/permissions/defs';

import { User } from './users.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  // TODO: Why do I need a @Query() necessarily?
  @Query(() => User, { nullable: true })
  async hi() {
    return this.usersService.collection.findOneRelational(
      {
        firstName: {
          $in: ['ba'],
        },
      },
      {
        firstName: 1,
      },
    );
  }

  @ResolveField(() => [Role])
  async roles(parent: User) {
    const { _id: userId } = parent;
    return this.permissionsService.find({ userId });
  }
}
