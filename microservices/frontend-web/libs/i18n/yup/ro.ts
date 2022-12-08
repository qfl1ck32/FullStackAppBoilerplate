import { LocaleObject } from 'yup/lib/locale';

export const array: LocaleObject['array'] = {
  length: 'Câmpul trebuie să conțină cel puțin ${length} elemente',
  max: 'Câmpul trebuie să aibă cel mult ${max} elemente',
  min: 'Câmpul trebuie să aibă cel puțin ${min} elemente',
};

export const boolean: LocaleObject['boolean'] = {};

export const date: LocaleObject['date'] = {
  max: 'Câmpul trebuie să fie înainte de ${max}',
  min: 'Câmpul trebuie să fie după ${min}',
};

export const mixed: LocaleObject['mixed'] = {
  default: 'Câmpul este invalid.',
  notOneOf: 'Câmpul nu poate avea una dintre următoarele valori: ${values}',
  oneOf: 'Câmpul trebuie să aibă una dintre următoarele valori: ${values}',
  required: 'Câmpul este obligatoriu',
};

export const number: LocaleObject['number'] = {
  integer: 'Câmpul trebuie să fie un număr întreg',
  lessThan: 'Câmpul trebuie să fie mai mic decât ${less}',
  max: 'Câmpul trebuie să fie mai mic sau egal decât ${max}',
  min: 'Câmpul trebuie să fie mai mare sau egal decât ${min}',
  moreThan: 'Câmpul trebuie să fie mai mare decât ${more}',
  negative: 'Câmpul trebuie să fie un număr negativ',
  positive: 'Câmpul trebuie să fie un număr pozitiv',
};

export const object: LocaleObject['object'] = {
  noUnknown: 'Câmpul nu poate avea chei nespecificate în forma obiectului',
};

export const string: LocaleObject['string'] = {
  email: 'Câmpul trebuie să fie un e-mail valid',
  length: 'Câmpul trebuie să conțină exact ${length} caractere',
  lowercase: 'Câmpul trebuie să fie un șir de caractere mici',
  matches: 'Câmpul trebuie să se potrivească următorului model: "${regex}"',
  max: 'Câmpul trebuie să aibă cel mult ${max} caractere',
  min: 'Câmpul trebuie să aibă cel puțin ${min} caractere',
  trim: 'Câmpul trebuie să nu conțină spații înainte sau după text',
  uppercase: 'Câmpul trebuie să fie un șir de caractere mari',
  url: 'Câmpul trebuie să fie un URL valid',
};

export const ro = {
  array,
  boolean,
  date,
  mixed,
  number,
  object,
  string,
} as LocaleObject;
