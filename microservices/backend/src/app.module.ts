import { Module } from '@nestjs/common';

import { AuthModule } from '@app/auth';
import { CollectionsModule } from '@app/collections';
import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { GraphQLModule } from '@app/graphql';
import { PermissionsModule } from '@app/permissions';
import { UsersModule } from '@app/users';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { StripeModule } from 'libs/stripe/src';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    GraphQLModule,
    CollectionsModule,
    StripeModule,
    AuthModule,
    UsersModule,

    PermissionsModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
