import constants from './constants';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import { resolve } from 'path';

const { languages, interpolation, defaultLanguage, MISSING_KEY, dirPath } =
  constants;

console.info('Generating the translation files...');

const interpolationRegex = new RegExp(
  `${interpolation.start}(.*?)${interpolation.end}`,
  'g',
);

const extractInterpolationArgs = (value: string) => {
  const args = [] as string[];

  const matches = value.matchAll(interpolationRegex);

  for (const match of matches) {
    const arg = match[1].trim();

    args.push(arg);
  }

  return args;
};

const removeKeys = (object: Record<string, any>) => {
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'object') {
      removeKeys(value);

      continue;
    }

    object[key] = MISSING_KEY;

    const interpArgs = extractInterpolationArgs(value);

    if (interpArgs.length) {
      object[key] += ` [${interpArgs.join(', ')}]`;
    }
  }
};

const assignFunctionEnglish = (
  target: Record<string, any>,
  source: Record<string, any>,
  key: string,
) => {
  Object.assign(target, { [key]: source[key] });
};

const assignFunctionOtherLanguages = async (
  target: Record<string, any>,
  source: Record<string, any>,
  key: string,
) => {
  Object.assign(target, {
    [key]:
      target[key] && target[key] !== MISSING_KEY ? target[key] : source[key],
  });
};

const main = async () => {
  const translations = {} as Record<string, any>;

  for (const language of languages) {
    const filePath = resolve(dirPath, `./translations/${language}.json`);

    let content = [];

    if (existsSync(filePath)) {
      content = JSON.parse(readFileSync(filePath, 'utf-8'));
    }

    translations[language] = content;
  }

  const filePaths = glob.sync(resolve(dirPath, '../../**/*.i18n.json'));

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

    await mergeDeep(fullTranslations, assignFunctionEnglish, result);
  }

  const fullTranslationsNoKeys = await mergeDeep(
    {},
    assignFunctionEnglish,
    fullTranslations,
  );

  removeKeys(fullTranslationsNoKeys);

  const results = {} as Record<string, any>;

  for (const language of languages) {
    const isDefaultLanguage = language === defaultLanguage;

    const currentFullTranslations = isDefaultLanguage
      ? fullTranslations
      : fullTranslationsNoKeys;

    const assignFunction = isDefaultLanguage
      ? assignFunctionEnglish
      : assignFunctionOtherLanguages;

    const result = {} as Record<string, any>;

    keepOnlyCurrentKeys(translations[language], currentFullTranslations);

    await mergeDeep(
      result,
      assignFunction,
      translations[language],
      currentFullTranslations,
    );

    results[language] = {};

    for (const key in result) {
      results[language][key] = result[key];
    }
  }

  for (const language of languages) {
    writeFileSync(
      resolve(dirPath, `./translations/${language}.json`),
      JSON.stringify(results[language], null, 2),
    );
  }

  const types = `export type Translations = ${JSON.stringify(
    results[defaultLanguage],
    null,
    2,
  )}`;

  writeFileSync(
    resolve(dirPath, `./translations/${defaultLanguage}.ts`),
    types,
  );

  console.log('Done.');
};

const keepOnlyCurrentKeys = (
  target: Record<string, any>,
  source: Record<string, any>,
) => {
  if (target instanceof Object && source instanceof Object) {
    for (const key in target) {
      if (source[key] instanceof Object) {
        keepOnlyCurrentKeys(target[key], source[key]);
      } else {
        if (!source[key]) {
          delete target[key];
        }
      }
    }
  }
};

const mergeDeep = async (
  target: Record<string, any>,
  assignFunction: Function,
  ...sources: Record<string, any>[]
): Promise<any> => {
  if (!sources.length) return target;

  const source = sources.shift();

  if (target instanceof Object && source instanceof Object) {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        await mergeDeep(target[key], assignFunction, source[key]);
      } else {
        await assignFunction(target, source, key);
      }
    }
  }

  return mergeDeep(target, assignFunction, ...sources);
};

main();
