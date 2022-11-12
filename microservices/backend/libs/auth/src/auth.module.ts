import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@app/config';
import { PermissionsModule } from '@app/permissions';

import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';

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
