import { LocaleObject } from 'yup/lib/locale';

export const array: LocaleObject['array'] = {
  length: 'Câmpul ${path} trebuie să conțină cel puțin ${length} elemente',
  max: 'Câmpul ${path} trebuie să aibă cel mult ${max} elemente',
  min: 'Câmpul ${path} trebuie să aibă cel puțin ${min} elemente',
};

export const boolean: LocaleObject['boolean'] = {};

export const date: LocaleObject['date'] = {
  max: 'Câmpul ${path} trebuie să fie înainte de ${max}',
  min: 'Câmpul ${path} trebuie să fie după ${min}',
};

export const mixed: LocaleObject['mixed'] = {
  default: 'Câmpul ${path} este invalid.',
  notOneOf:
    'Câmpul ${path} nu poate avea una dintre următoarele valori: ${values}',
  oneOf:
    'Câmpul ${path} trebuie să aibă una dintre următoarele valori: ${values}',
  required: 'Câmpul ${path} este obligatoriu',
};

export const number: LocaleObject['number'] = {
  integer: 'Câmpul ${path} trebuie să fie un număr întreg',
  lessThan: 'Câmpul ${path} trebuie să fie mai mic decât ${less}',
  max: 'Câmpul ${path} trebuie să fie mai mic sau egal decât ${max}',
  min: 'Câmpul ${path} trebuie să fie mai mare sau egal decât ${min}',
  moreThan: 'Câmpul ${path} trebuie să fie mai mare decât ${more}',
  negative: 'Câmpul ${path} trebuie să fie un număr negativ',
  positive: 'Câmpul ${path} trebuie să fie un număr pozitiv',
};

export const object: LocaleObject['object'] = {
  noUnknown:
    'Câmpul ${path} nu poate avea chei nespecificate în forma obiectului',
};

export const string: LocaleObject['string'] = {
  email: 'Câmpul ${path} trebuie să fie un e-mail valid',
  length: 'Câmpul ${path} trebuie să conțină exact ${length} caractere',
  lowercase: 'Câmpul ${path} trebuie să fie un șir de caractere mici',
  matches:
    'Câmpul ${path} trebuie să se potrivească următorului model: "${regex}"',
  max: 'Câmpul ${path} trebuie să aibă cel mult ${max} caractere',
  min: 'Câmpul ${path} trebuie să aibă cel puțin ${min} caractere',
  trim: 'Câmpul ${path} trebuie să nu conțină spații înainte sau după text',
  uppercase: 'Câmpul ${path} trebuie să fie un șir de caractere mari',
  url: 'Câmpul ${path} trebuie să fie un URL valid',
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
