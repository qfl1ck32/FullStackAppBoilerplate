import { Module } from '@nestjs/common';

import { AuthModule } from '@app/auth';
import { UsersModule } from '@app/auth/users/users.module';
import { CollectionsModule } from '@app/collections';
import { ConfigModule } from '@app/config';
import { CoreModule } from '@app/core';
import { DatabaseModule } from '@app/database';
import { EmailModule } from '@app/email';
import { EventManagerModule } from '@app/event-manager';
import { ExceptionsModule } from '@app/exceptions';
import { GraphQLModule } from '@app/graphql';
import { PermissionsModule } from '@app/permissions';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    CollectionsModule,
    ConfigModule,
    CoreModule,
    DatabaseModule,
    EmailModule,
    EventManagerModule,
    ExceptionsModule,
    GraphQLModule,
    PermissionsModule,

    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
