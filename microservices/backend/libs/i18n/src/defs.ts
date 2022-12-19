import { WriterArgs } from '@app/core/models/defs';

export enum Language {
  en = 'en',
  ro = 'ro',
}

export interface I18nModuleForRootArgs {
  languageRef?: any;
}

export interface UpdateTranslationsArgs
  extends WriterArgs,
    Omit<State, 'interpolationRegex'> {}

export interface State {
  missingKey: string;

  // TODO: this is the disadvantage of modifying the enum at runtime.
  // If I want to have this as "Language", I can't use my new "Language" enum.
  defaultLanguage: string;

  interpolation: {
    start: string;
    end: string;
  };

  i18nFilesRegex: string;
}
