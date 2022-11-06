import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PermissionsModule } from '@root/permissions/permissions.module';
import { UsersSecurityService } from '@root/users-security/users-security.service';
import { DatabaseModule } from '@root/database/database.module';

@Module({
  imports: [
    DatabaseModule,

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    PermissionsModule,
  ],

  providers: [UsersResolver, UsersService, UsersSecurityService],

  exports: [UsersService, UsersSecurityService],
})
export class UsersModule {}
