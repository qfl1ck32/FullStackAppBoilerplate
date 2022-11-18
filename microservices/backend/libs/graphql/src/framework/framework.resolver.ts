import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class FrameworkResolver {
  @Query(() => String)
  async framework() {
    return '32';
  }
}
