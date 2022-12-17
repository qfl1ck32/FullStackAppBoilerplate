import { Module } from '@nestjs/common';

import { EndUsersResolver } from './end-users.resolver';
import { EndUsersService } from './end-users.service';

import { TodosModule } from '@root/todos/todos.module';

@Module({
  imports: [TodosModule],
  providers: [EndUsersService, EndUsersResolver],
})
export class EndUsersModule {}
