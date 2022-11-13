import { Provider } from '@nestjs/common';

import { Constructor } from '@app/core/defs';
import { DatabaseService } from '@app/database';
import { EventManagerService } from '@app/event-manager';

import { Collection } from './collections.class';
import { getCollectionToken } from './defs';

export function ProvideCollection<T>(entity: Constructor<T>) {
  return {
    provide: getCollectionToken(entity),

    useFactory: (
      databaseService: DatabaseService,
      eventManager: EventManagerService,
    ) => {
      return new Collection(entity, databaseService, eventManager);
    },

    inject: [DatabaseService, EventManagerService],
  } as Provider;
}
