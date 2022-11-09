import { Query, Resolver } from '@nestjs/graphql';

import { ObjectId } from '@root/database/defs';
import { UserId } from '@root/graphql/graphql.decorators';
import { RequireRoles } from '@root/roles/roles.decorator';
import { Role } from '@root/roles/roles.enum';

@Resolver()
export class TestResolver {
  @Query(() => String)
  @RequireRoles(Role.END_USER)
  async getHello(@UserId() userId: ObjectId) {
    return 'Hello!';
  }
}
