import {
  Join,
  NestedPaths,
  NestedPathsObjectUntilLeaf,
  NestedPathsObjectsJustLeaf,
} from '@libs/core/defs';

import { Language } from '@root/gql/operations';

import { Translations } from './translations/en';

export type InterpolationStrings = {
  start: '{{ ';
  end: ' }}';
};

export type I18NMessages = {
  [key: string]: string | I18NMessages;
};

export type AllPhrases = Join<
  NestedPathsObjectsJustLeaf<Translations, []>,
  '.'
>;

export type AllPhrasesPrefixes = Join<
  NestedPathsObjectUntilLeaf<Translations, []>,
  '.'
>;

export type ExtractInterpolation<T extends string> =
  T extends `${infer A}${InterpolationStrings['start']}${infer B}${InterpolationStrings['end']}${infer C}`
    ? ExtractInterpolation<A> | B | ExtractInterpolation<C>
    : never;

export type ExtractInterpolationStringsFromTranslation<
  T extends AllPhrases,
  // @ts-ignore
> = ExtractInterpolation<GetDeep<Translations, T>>;

export type InterpolationKeys<
  Prefix extends AllPhrasesPrefixes | undefined = undefined,
  P = Phrase<Prefix>,
> = Prefix extends undefined
  ? // @ts-ignore
    ExtractInterpolationStringsFromTranslation<P>
  : // @ts-ignore
    ExtractInterpolationStringsFromTranslation<Join<[Prefix, P], '.'>>;

export type GetDeep<
  T extends Record<string, any>,
  R extends Join<NestedPaths<T, []>, '.'>,
> = R extends keyof T
  ? T[R]
  : R extends `${infer A}.${infer B}`
  ? // @ts-ignore
    GetDeep<T[A], B>
  : any;

export type Phrase<T extends AllPhrasesPrefixes | undefined> =
  T extends undefined
    ? AllPhrases
    : Join<
        NestedPaths<
          T extends AllPhrasesPrefixes ? GetDeep<Translations, T> : any,
          []
        >,
        '.'
      >;

declare module '@libs/session/defs' {
  export interface ISessionStorage {
    language: Language;
  }
}
