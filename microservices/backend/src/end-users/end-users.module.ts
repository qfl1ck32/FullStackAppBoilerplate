import { Module } from '@nestjs/common';

import { ProvideCollection } from '@app/collections/collections.provider';

import { EndUsersEntity } from './end-users';
import { EndUsersResolver } from './end-users.resolver';
import { EndUsersService } from './end-users.service';

import { TodosModule } from '@root/todos/todos.module';

@Module({
  imports: [TodosModule],
  providers: [
    EndUsersService,
    EndUsersResolver,
    ProvideCollection(EndUsersEntity),
  ],
})
export class EndUsersModule {}
