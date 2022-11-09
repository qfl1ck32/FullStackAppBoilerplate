import { Module } from '@nestjs/common';

import { ExceptionsModule } from './exceptions/exceptions.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { EmailService } from './email/email.service';
import { EventManagerModule } from './event-manager/event-manager.module';
import { EventManagerService } from './event-manager/event-manager.service';
import { GraphQLModule } from './graphql/graphql.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RouterService } from './router/router.service';
import { TestResolver } from './test/test.resolver';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule,
    AuthModule,
    ConfigModule,
    PermissionsModule,
    ExceptionsModule,
    EventManagerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TestResolver,
    EmailService,
    RouterService,
    EventManagerService,
  ],
})
export class AppModule {}
