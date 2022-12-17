import { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { Language } from './defs';
import { I18nService } from './i18n.service';

@Global()
@Module({})
export class I18nModule {
  static forRoot(): DynamicModule {
    registerEnumType(Language, {
      name: 'Language',
    });

    return {
      module: I18nModule,

      providers: [I18nService],
      exports: [I18nService],
    };
  }
}