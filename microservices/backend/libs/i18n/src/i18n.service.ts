import { Injectable } from '@nestjs/common';

import { mergeDeep } from '@app/core/core.utils';
import { Writer } from '@app/core/models/writer';
import { LoggerService } from '@app/logger';

import { OneWritePathRequiredException } from './exceptions/one-write-path-required.exception';

import { Language, State, UpdateTranslationsArgs } from './defs';

import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { resolve } from 'path';

@Injectable()
export class I18nService extends Writer {
  private state: State;

  get interpolationRegex() {
    return new RegExp(
      `${this.state.interpolation.start}(.*?)${this.state.interpolation.end}`,
      'g',
    );
  }

  constructor(protected readonly loggerService: LoggerService) {
    super();
  }

  private extractInterpolationArgs(value: string) {
    const args = [] as string[];

    const matches = value.matchAll(this.interpolationRegex);

    for (const match of matches) {
      const arg = match[1].trim();

      args.push(arg);
    }

    return args;
  }

  private assignFunctionEnglish(
    target: Record<string, any>,
    source: Record<string, any>,
    key: string,
  ) {
    Object.assign(target, { [key]: source[key] });
  }

  private assignFunctionOtherLanguages(
    target: Record<string, any>,
    source: Record<string, any>,
    key: string,
  ) {
    Object.assign(target, {
      [key]:
        target[key] && target[key] !== this.state.missingKey
          ? target[key]
          : source[key],
    });
  }

  private removeKeys(object: Record<string, any>) {
    for (const [key, value] of Object.entries(object)) {
      if (typeof value === 'object') {
        this.removeKeys(value);

        continue;
      }

      object[key] = this.state.missingKey;

      const interpArgs = this.extractInterpolationArgs(value);

      if (interpArgs.length) {
        object[key] += ` ${interpArgs.map((arg) => `{{ ${arg} }}`).join(', ')}`;
      }
    }
  }

  private keepOnlyCurrentKeys(
    target: Record<string, any>,
    source: Record<string, any>,
  ) {
    if (target instanceof Object && source instanceof Object) {
      for (const key in target) {
        if (source[key] instanceof Object) {
          this.keepOnlyCurrentKeys(target[key], source[key]);
        } else {
          if (!source[key]) {
            delete target[key];
          }
        }
      }
    }
  }

  async updateTranslations(args: UpdateTranslationsArgs) {
    const { writePath } = args;

    super.initialise(args);

    if (Array.isArray(writePath)) {
      if (writePath.length > 1) {
        throw new OneWritePathRequiredException();
      }
    }

    this.state = args;

    const languages = Object.values(Language);

    super.initialise(args);

    const translations = {} as Record<string, any>;

    for (const language of languages) {
      const filePath = resolve(this.writePaths[0], `${language}.json`);

      let content = [];

      if (existsSync(filePath)) {
        content = JSON.parse(readFileSync(filePath, 'utf-8'));
      }

      translations[language] = content;
    }

    const filePaths = glob.sync(this.state.i18nFilesRegex);

    let fullTranslations = {} as Record<string, any>;

    for (const filePath of filePaths) {
      const fileContent = JSON.parse(readFileSync(filePath, 'utf-8'));

      const path = filePath.split('/');

      const name = path[path.length - 1].split('.i18n.json')[0].split('.');

      const result = {} as Record<string, any>;

      let resultPointer = result;

      for (const key of name.slice(0, name.length - 1)) {
        resultPointer[key] = {};

        resultPointer = resultPointer[key];
      }

      resultPointer[name[name.length - 1]] = fileContent;

      await mergeDeep({
        target: fullTranslations,
        assignFunction: this.assignFunctionEnglish,
        sources: [result],
      });
    }

    const fullTranslationsNoKeys = await mergeDeep({
      target: {},
      assignFunction: this.assignFunctionEnglish,
      sources: [fullTranslations],
    });

    this.removeKeys(fullTranslationsNoKeys);

    const results = {} as Record<string, any>;

    for (const language of languages) {
      const isDefaultLanguage = language === this.state.defaultLanguage;

      const currentFullTranslations = isDefaultLanguage
        ? fullTranslations
        : fullTranslationsNoKeys;

      const assignFunction = isDefaultLanguage
        ? this.assignFunctionEnglish
        : this.assignFunctionOtherLanguages.bind(this);

      const result = {} as Record<string, any>;

      this.keepOnlyCurrentKeys(translations[language], currentFullTranslations);

      await mergeDeep({
        target: result,
        assignFunction,
        sources: [translations[language], currentFullTranslations],
      });

      results[language] = {};

      for (const key in result) {
        results[language][key] = result[key];
      }
    }

    for (const language of languages) {
      super.write(
        JSON.stringify(results[language], null, 2),
        `${language}.json`,
      );
    }

    const types = `export type Translations = ${JSON.stringify(
      results[this.state.defaultLanguage],
      null,
      2,
    )}`;

    super.write(types, `${this.state.defaultLanguage}.ts`);

    this.loggerService.info('Success');
  }
}
