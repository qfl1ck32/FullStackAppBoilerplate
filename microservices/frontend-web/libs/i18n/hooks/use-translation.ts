import { use } from '@libs/di/hooks/use';
import Polyglot from 'node-polyglot';

import {
  AllPhrases,
  AllPhrasesPrefixes,
  ExtractInterpolationStringsFromTranslation,
  InterpolationKeys,
  Phrase,
} from '../defs';
import { I18NService } from '../i18n.service';

export const useTranslation = <
  T extends AllPhrasesPrefixes | undefined = undefined,
>(
  prefix?: T,
) => {
  const service = use(I18NService);

  const t = <P extends Phrase<T>>(
    // @ts-ignore
    phrase: P,
    options?:
      | Pick<Polyglot.InterpolationOptions, 'smart_count' | '_'>
      // @ts-ignore
      | Record<InterpolationKeys<T, P>, string>,
  ) => {
    return service.t(
      prefix ? (`${prefix}.${phrase}` as any) : phrase,
      options as any,
    );
  };

  return t;
};
