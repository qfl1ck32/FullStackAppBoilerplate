import constants from './constants';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

export interface TranslateOptions {
  from: string;
  to: string;
}

const { dirPath } = constants;

const main = async () => {
  const locale = process.argv[2];

  const localeObject = await translateLocale(locale);

  const localeObjectFileName = resolve(dirPath, `./yup/${locale}.ts`);

  writeFileSync(localeObjectFileName, localeObject);

  execSync(`prettier ${localeObjectFileName} --write`);
};

const translate = async (text: string, options: TranslateOptions) => {
  const { from, to } = options;

  const response = await fetch('http://localhost:5000/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
    }),
  });

  const json = await response.json();

  console.log(json);

  return json.translatedText;
};

const translateLocale = async (to: string) => {
  const t = async (value: string) => {
    const parameters = [] as string[];

    console.log(value);

    value = value.replace(/\${([^}]+)}/g, (_, value) => {
      const index = parameters.push(value);

      return '[__' + index + '__]';
    });

    value = await translate(value, {
      to,
      from: 'en',
    });

    value = value.replace(/\[__([^__\]]+)__]/g, (_, index) => {
      const value = parameters[index - 1];

      return '${' + value + '}';
    });

    return value;
  };

  return `
import { LocaleObject } from 'yup/lib/locale';

export const array: LocaleObject["array"] = {
    length: '${await t('${path} field must have at least ${length} items')}',
    max: '${await t(
      '${path} field must have less than or equal to ${max} items',
    )}',
    min: '${await t('${path} field must have at least ${min} items')}',
};

export const boolean: LocaleObject["boolean"] = {};

export const date: LocaleObject["date"] = {
    max: '${await t('${path} field must be at earlier than ${max}')}',
    min: '${await t('${path} field must be later than ${min}')}',
};

export const mixed: LocaleObject['mixed'] = {
    default: '${await t('${path} is invalid.')}',
    notOneOf: '${await t(
      '${path} must not be one of the following values: ${values}',
    )}',
    oneOf: '${await t(
      '${path} must be one of the following values: ${values}',
    )}',
    required: '${await t('${path} is a required field')}',
};

export const number: LocaleObject["number"] = {
    integer: '${await t('${path} must be an integer')}',
    lessThan: '${await t('${path} must be less than ${less}')}',
    max: '${await t('${path} must be less than or equal to ${max}')}',
    min: '${await t('${path} must be greater than or equal to ${min}')}',
    moreThan: '${await t('${path} must be greater than ${more}')}',
    negative: '${await t('${path} must be a negative number')}',
    positive: '${await t('${path} must be a positive number')}',
};
  
export const object: LocaleObject["object"] = {
    noUnknown: '${await t(
      '${path} field cannot have keys not specified in the object shape',
    )}',
};

export const string: LocaleObject["string"] = {
    email: '${await t('${path} must be a valid email')}',
    length: '${await t('${path} must be exactly ${length} characters')}',
    lowercase: '${await t('${path} must be a lowercase string')}',
    matches: '${await t('${path} must match the following: "${regex}"')}',
    max: '${await t('${path} must be at most ${max} characters')}',
    min: '${await t('${path} must be at least ${min} characters')}',
    trim: '${await t('${path} must be a trimmed string')}',
    uppercase: '${await t('${path} must be a upper case string')}',
    url: '${await t('${path} must be a valid URL')}',
};

export const ${to} = {
    array,
    boolean,
    date,
    mixed,
    number,
    object,
    string,
} as LocaleObject;
`;
};

main();
