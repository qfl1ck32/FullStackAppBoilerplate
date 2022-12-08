import { Join, NestedPaths } from '@libs/core/defs';

import { Language } from '@root/gql/operations';

import * as translations from './translations/en.json';

export type I18NMessages = {
  [key: string]: string | I18NMessages;
};

// TODO: remove the last one in NestedPaths<...>
export type AllPhrases = Join<NestedPaths<typeof translations, []>, '.'>;

export type GetDeep<
  T extends Record<string, any>,
  R extends Join<NestedPaths<T, []>, '.'>,
> = R extends keyof T
  ? T[R]
  : R extends `${infer A}.${infer B}`
  ? // @ts-ignore
    GetDeep<T[A], B>
  : any;

export type Phrase<T extends AllPhrases = any> = Join<
  NestedPaths<
    T extends any ? typeof translations : GetDeep<typeof translations, T>,
    []
  >,
  '.'
>;

declare module '@libs/session/defs' {
  export interface ISessionStorage {
    language: Language;
  }
}
