import { Constructor } from '@libs/core/defs';
import { use } from '@libs/di/hooks/use';
import { useEffect, useState } from 'react';

import { StateService } from '../state.service';

export function useStateService<T extends StateService>(
  Service: Constructor<T>,
) {
  const service = use(Service) as any;

  const [_, setState] = useState();

  useEffect(() => {
    service.__subscribe(setState);

    return () => {
      service.__unsubscribe(setState);
    };
  }, []);

  return service as T;
}
