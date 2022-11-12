import { Module } from '@nestjs/common';

import { DatabaseModule } from '@root/database/database.module';
import { DatabaseService } from '@root/database/database.service';
import { EventManagerModule } from '@root/event-manager/event-manager.module';
import { EventManagerService } from '@root/event-manager/event-manager.service';
import { PermissionsModule } from '@root/permissions/permissions.module';
import { UsersSecurityService } from '@root/users-security/users-security.service';

import { UsersCollection } from './entities/user.entity';

import { UsersService } from './users.service';

@Module({
  imports: [PermissionsModule, EventManagerModule, DatabaseModule],

  providers: [
    UsersService,
    UsersSecurityService,
    DatabaseService,
    EventManagerService,
    UsersCollection,
  ],

  exports: [UsersService, UsersSecurityService],
})
export class UsersModule {}
