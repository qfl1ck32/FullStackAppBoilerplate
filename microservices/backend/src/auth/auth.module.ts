import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PermissionsModule } from '@root/permissions/permissions.module';
import { UsersModule } from '@root/users/users.module';

import { AuthMiddleware } from './auth.middleware';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, PermissionsModule],

  providers: [AuthService, JwtService, ConfigService, AuthResolver],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/graphql');
  }
}
