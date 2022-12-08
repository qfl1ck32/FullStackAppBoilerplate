import { Constructor } from '@libs/core/defs';
import { useMemo } from 'react';

import { container } from '../container';

export function use<T>(identifier: Constructor<T>, transient?: boolean): T {
  if (transient) {
    return container.get(identifier);
  }

  return useMemo(() => {
    return container.get(identifier);
  }, []);
}
