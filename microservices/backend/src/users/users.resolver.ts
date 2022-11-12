import { Query, ResolveField, Resolver } from '@nestjs/graphql';

import { PermissionsService } from '@root/permissions/permissions.service';
import { Role } from '@root/roles/roles.enum';

import { User } from './entities/user.entity';

import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  // Todo: Why do I need a @Query() necessarily?
  @Query(() => User, { nullable: true })
  async hi() {
    return this.usersService.collection.queryOne(
      {
        firstName: {
          $in: ['ba'],
        },
      },
      {
        firstName: 1,
        createdByUser: {
          _id: 1,

          createdByUser: {
            _id: 1,
          },
        },
      },
    );
  }

  @ResolveField(() => [Role])
  async roles(parent: User) {
    // const { _id: userId } = parent;
    // return this.permissionsService.find({ userId });
  }
}
