import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthMiddleware } from './auth.middleware';
import { PermissionsModule } from '@root/permissions/permissions.module';
import { UsersModule } from '@root/users/users.module';

@Module({
  imports: [UsersModule, PermissionsModule],

  providers: [AuthService, JwtService, ConfigService, AuthResolver],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/graphql');
  }
}
