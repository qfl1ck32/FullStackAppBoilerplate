import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@root/config/config.module';
import { PermissionsModule } from '@root/permissions/permissions.module';
import { UsersModule } from '@root/users/users.module';

import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, ConfigModule, PermissionsModule],

  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/graphql');
  }
}
