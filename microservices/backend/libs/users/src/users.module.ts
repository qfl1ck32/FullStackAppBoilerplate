import { Global, Module } from '@nestjs/common';

import { ProvideCollection } from '@app/collections/collections.provider';

import { UsersSecurityService } from './users-security.service';
import { UserEntity } from './users.class';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Global()
@Module({
  providers: [
    UsersService,
    UsersSecurityService,
    ProvideCollection(UserEntity),
    UsersResolver,
  ],

  exports: [UsersService, UsersSecurityService],
})
export class UsersModule {}
