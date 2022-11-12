import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';

import { UsersCollection } from './entities/user.entity';

import { UsersService } from './users.service';

import { UsersSecurityService } from '../users-security/users-security.service';

@Module({
  imports: [DatabaseModule],

  providers: [UsersService, UsersSecurityService, UsersCollection],
  exports: [UsersService, UsersSecurityService, UsersCollection],
})
export class UsersModule {}
