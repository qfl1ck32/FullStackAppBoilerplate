import { dayjs } from '@libs/dayjs/day-js.service';
import { Injectable } from '@libs/di/decorators';
import { yup } from '@libs/yup/yup.service';
import Polyglot from 'node-polyglot';

import { Language } from '@root/gql/operations';

import { Phrase } from './defs';
import translations from './translations/en.json';
import * as yupLocale from './yup';

@Injectable()
export class I18NService {
  private polyglots: Map<Language, Polyglot>;

  private defaultLocale: Language;

  public activePolyglot: Polyglot;

  constructor() {
    this.defaultLocale = Language.En;

    this.polyglots = new Map();

    for (const language of Object.values(Language)) {
      const phrases = require(`./translations/${language}.json`);

      const polyglot = new Polyglot({
        locale: language,
        phrases: [],

        interpolation: {
          prefix: '{{ ',
          suffix: ' }}',
        },
      });

      polyglot.extend(phrases);

      this.polyglots.set(language, polyglot);
    }

    this.activePolyglot = this.polyglots.get(this.defaultLocale) as Polyglot;
  }

  public onLanguageChange(language: Language) {
    this.activePolyglot = this.polyglots.get(language) as Polyglot;

    yup.setLocale(yupLocale[language]);
    dayjs.locale(language);
  }

  public t<T extends keyof typeof translations>(
    phrase: Phrase<T>,
    options?: number | Polyglot.InterpolationOptions | undefined,
  ) {
    return this.activePolyglot.t(phrase, options);
  }
}
