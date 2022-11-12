import { Module } from '@nestjs/common';

import { ExceptionsModule } from './exceptions/exceptions.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { EventManagerModule } from './event-manager/event-manager.module';
import { GraphQLModule } from './graphql/graphql.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule,
    AuthModule,
    ConfigModule,
    PermissionsModule,
    ExceptionsModule,
    EventManagerModule,
    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
