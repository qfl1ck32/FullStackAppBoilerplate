import { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { replaceEnumAtRuntime } from '@app/core/core.utils';
import { registerEnumType } from '@app/graphql/defs';

import { I18nModuleForRootArgs, Language } from './defs';
import { I18nService } from './i18n.service';

@Global()
@Module({})
export class I18nModule {
  static forRoot(args: I18nModuleForRootArgs = {}): DynamicModule {
    const NewLanguage = args.languageRef;

    if (NewLanguage) {
      replaceEnumAtRuntime(Language, NewLanguage);
    }

    registerEnumType({ Language });

    return {
      module: I18nModule,

      providers: [I18nService],
      exports: [I18nService],
    };
  }
}
