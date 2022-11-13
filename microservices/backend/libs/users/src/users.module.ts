import { Module } from '@nestjs/common';

import { ProvideCollection } from '@app/collections/collections.provider';
import { DatabaseModule } from '@app/database';
import { PermissionsModule } from '@app/permissions';

import { UsersSecurityService } from './users-security.service';
import { User } from './users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, PermissionsModule],

  providers: [
    UsersService,
    UsersSecurityService,
    ProvideCollection(User),
    UsersResolver,
  ],
  exports: [UsersService, UsersSecurityService],
})
export class UsersModule {}
