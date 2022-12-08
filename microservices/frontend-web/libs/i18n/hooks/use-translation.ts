import { use } from '@libs/di/hooks/use';
import Polyglot from 'node-polyglot';

import { AllPhrases, Phrase } from '../defs';
import { I18NService } from '../i18n.service';

export const useTranslation = <T extends AllPhrases>(prefix?: T) => {
  const service = use(I18NService);

  return (
    phrase: Phrase<T>,
    options?: number | Polyglot.InterpolationOptions | undefined,
  ) => service.t(prefix ? (`${prefix}.${phrase}` as any) : phrase, options);
};
