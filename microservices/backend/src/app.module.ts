import { Inject, Module } from '@nestjs/common';

import { AuthModule } from '@app/auth';
import { CollectionsModule } from '@app/collections';
import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { ExceptionsModule } from '@app/exceptions';
import { ExceptionsService } from '@app/exceptions/exceptions.service';
import { GraphQLModule } from '@app/graphql';
import { I18nModule, I18nService } from '@app/i18n';
import { LoggerModule } from '@app/logger';
import { PermissionsModule } from '@app/permissions';
import { StripeModule } from '@app/stripe';
import { UsersModule } from '@app/users';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import './defs';
import { Language, Role } from './defs';
import { EndUsersModule } from './end-users/end-users.module';
import { TodosModule } from './todos/todos.module';

import { YupModule, YupService } from 'libs/yup/src';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    GraphQLModule,
    CollectionsModule,
    StripeModule,
    AuthModule,
    UsersModule,
    YupModule,
    ExceptionsModule,
    LoggerModule,

    PermissionsModule.forRoot({
      roleRef: Role,
    }),

    I18nModule.forRoot({
      languageRef: Language,
    }),

    TodosModule,
    EndUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @Inject()
  private yupService: YupService;

  @Inject()
  private exceptionsService: ExceptionsService;

  @Inject()
  private i18nService: I18nService;

  async onModuleInit() {
    const frontendMicroservicePath = '../../microservices/frontend-web';

    await this.i18nService.updateTranslations({
      missingKey: 'MISSING_KEY',
      interpolation: {
        start: '{{ ',
        end: ' }}',
      },

      defaultLanguage: Language.en,

      writePath: `${frontendMicroservicePath}/libs/i18n/translations`,

      i18nFilesRegex: `${frontendMicroservicePath}/**/*.i18n.json`,
    });

    // await this.yupService.generateSchema({
    //   fileName: 'schema.ts',
    //   writePath: [`${frontendMicroservicePath}/src/yup`],
    // });

    // await this.exceptionsService.extract({
    //   exceptionsPath: './**/*.exception.ts',

    //   fileName: 'exceptions.i18n.json',
    //   writePath: [`${frontendMicroservicePath}/src/i18n`],
    // });
  }
}
