import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { TestResolver } from './test/test.resolver';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule,
    AuthModule,
    ConfigModule,
    PermissionsModule,
    ExceptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TestResolver],
})
export class AppModule {}
