import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@app/config';
import { PermissionsModule } from '@app/permissions';
import { UsersModule } from '@app/users';

import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule, UsersModule, PermissionsModule],

  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/graphql');
  }
}
