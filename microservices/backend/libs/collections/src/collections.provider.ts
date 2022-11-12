import { Provider } from '@nestjs/common';

import { Constructor } from '@app/core/defs';
import { DatabaseService } from '@app/database';
import { EventManagerService } from '@app/event-manager';

import { Collection } from './collections.class';
import { getCollectionProviderKey } from './defs';

export function ProvideCollection<T>(entity: Constructor<T>) {
  return {
    provide: getCollectionProviderKey(entity),

    useFactory: (
      databaseService: DatabaseService,
      eventManager: EventManagerService,
    ) => {
      console.log(entity);
      return new Collection(entity, databaseService, eventManager);
    },

    inject: [DatabaseService, EventManagerService],
  } as Provider;
}
