import { LocaleObject } from 'yup/lib/locale';

export const array: LocaleObject['array'] = {
  length: '${path} field must have at least ${length} items',
  max: '${path} field must have less than or equal to ${max} items',
  min: '${path} field must have at least ${min} items',
};

export const boolean: LocaleObject['boolean'] = {};

export const date: LocaleObject['date'] = {
  max: '${path} field must be at earlier than ${max}',
  min: '${path} field must be later than ${min}',
};

export const mixed: LocaleObject['mixed'] = {
  default: '${path} is invalid.',
  notOneOf: '${path} must not be one of the following values: ${values}',
  oneOf: '${path} must be one of the following values: ${values}',
  required: '${path} is a required field',
};

export const number: LocaleObject['number'] = {
  integer: '${path} must be an integer',
  lessThan: '${path} must be less than ${less}',
  max: '${path} must be less than or equal to ${max}',
  min: '${path} must be greater than or equal to ${min}',
  moreThan: '${path} must be greater than ${more}',
  negative: '${path} must be a negative number',
  positive: '${path} must be a positive number',
};

export const object: LocaleObject['object'] = {
  noUnknown: '${path} field cannot have keys not specified in the object shape',
};

export const string: LocaleObject['string'] = {
  email: '${path} must be a valid email',
  length: '${path} must be exactly ${length} characters',
  lowercase: '${path} must be a lowercase string',
  matches: '${path} must match the following: "${regex}"',
  max: '${path} must be at most ${max} characters',
  min: '${path} must be at least ${min} characters',
  trim: '${path} must be a trimmed string',
  uppercase: '${path} must be an upper case string',
  url: '${path} must be a valid URL',
};

export const en = {
  array,
  boolean,
  date,
  mixed,
  number,
  object,
  string,
} as LocaleObject;
