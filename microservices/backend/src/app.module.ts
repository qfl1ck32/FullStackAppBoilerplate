import { Inject, Module } from '@nestjs/common';

import { AuthModule } from '@app/auth';
import { CollectionsModule } from '@app/collections';
import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { GraphQLModule } from '@app/graphql';
import { I18nModule } from '@app/i18n';
import { LoggerModule } from '@app/logger';
import { PermissionsModule } from '@app/permissions';
import { StripeModule } from '@app/stripe';
import { UsersModule } from '@app/users';
import {
  YupSchemaGeneratorModule,
  YupSchemaGeneratorService,
} from '@app/yup-schema-generator';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EndUsersModule } from './end-users/end-users.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    GraphQLModule,
    CollectionsModule,
    StripeModule,
    AuthModule,
    UsersModule,
    YupSchemaGeneratorModule,

    LoggerModule,

    PermissionsModule.forRoot(),
    I18nModule.forRoot(),
    TodosModule,
    EndUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @Inject()
  private yupSchemaGeneratorService: YupSchemaGeneratorService;

  async onModuleInit() {
    this.generateYupSchema();
  }

  async generateYupSchema() {
    await this.yupSchemaGeneratorService.init();

    await this.yupSchemaGeneratorService.generateSchema();

    await this.yupSchemaGeneratorService.writeSchema();
  }
}
