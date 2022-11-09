import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CollectionProvider } from '@root/database/collections/collection.class';
import { DatabaseService } from '@root/database/database.service';
import { EmailService } from '@root/email/email.service';
import { EventManagerModule } from '@root/event-manager/event-manager.module';
import { PermissionsModule } from '@root/permissions/permissions.module';
import { RouterService } from '@root/router/router.service';
import { UsersSecurityService } from '@root/users-security/users-security.service';

import { User } from './entities/user.entity';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [PermissionsModule, EventManagerModule],

  providers: [
    UsersResolver,
    UsersService,
    UsersSecurityService,
    EmailService,
    ConfigService,
    RouterService,
    DatabaseService,
    CollectionProvider(User),
  ],

  exports: [UsersService, UsersSecurityService],
})
export class UsersModule {}
