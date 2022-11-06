import { Query, Resolver } from '@nestjs/graphql';
import { RequireRoles } from '@root/roles/roles.decorator';
import { Role } from '@root/roles/roles.enum';

@Resolver()
export class TestResolver {
  @Query(() => String)
  @RequireRoles(Role.END_USER)
  async getHello() {
    return 'Hello!';
  }
}
