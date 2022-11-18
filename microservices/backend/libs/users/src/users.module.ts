import { Module } from '@nestjs/common';

import { CollectionsModule } from '@app/collections';
import { ProvideCollection } from '@app/collections/collections.provider';
import { DatabaseModule } from '@app/database';
import { PermissionsModule } from '@app/permissions';

import { UserEntity } from './users';
import { UsersSecurityService } from './users-security.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, PermissionsModule, CollectionsModule],

  providers: [
    UsersService,
    UsersSecurityService,
    ProvideCollection(UserEntity),
    UsersResolver,
  ],
  exports: [UsersService, UsersSecurityService],
})
export class UsersModule {}
