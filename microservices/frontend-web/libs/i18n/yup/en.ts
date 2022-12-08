import { LocaleObject } from 'yup/lib/locale';

export const array: LocaleObject['array'] = {
  length: 'The field must have at least ${length} items',
  max: 'The field must have less than or equal to ${max} items',
  min: 'The field must have at least ${min} items',
};

export const boolean: LocaleObject['boolean'] = {};

export const date: LocaleObject['date'] = {
  max: 'The date must be earlier than ${max}',
  min: 'The date must be later than ${min}',
};

export const mixed: LocaleObject['mixed'] = {
  default: 'The field is invalid',
  notOneOf: 'The field must not be one of the following values: ${values}',
  oneOf: 'The field must be one of the following values: ${values}',
  required: 'The field is required',
};

export const number: LocaleObject['number'] = {
  integer: 'The field must be an integer',
  lessThan: 'The field must be less than ${less}',
  max: 'The field must be less than or equal to ${max}',
  min: 'The field must be greater than or equal to ${min}',
  moreThan: 'The field must be greater than ${more}',
  negative: 'The field must be a negative number',
  positive: 'The field must be a positive number',
};

export const object: LocaleObject['object'] = {
  noUnknown: 'The field cannot have keys not specified in the object shape',
};

export const string: LocaleObject['string'] = {
  email: 'The field must be a valid email',
  length: 'The field must be exactly ${length} characters',
  lowercase: 'The field must be a lowercase string',
  matches: 'The field must match the following: "${regex}"',
  max: 'The field must be at most ${max} characters',
  min: 'The field must be at least ${min} characters',
  trim: 'The field must be a trimmed string',
  uppercase: 'The field must be an upper case string',
  url: 'The field must be a valid URL',
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
