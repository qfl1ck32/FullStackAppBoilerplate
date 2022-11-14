import { Provider } from '@nestjs/common';

import { Constructor } from '@app/core/defs';
import { DatabaseService } from '@app/database';
import { EventManagerService } from '@app/event-manager';

import { Collection } from './collections.class';
import { CollectionsStorage } from './collections.storage';
import { getCollectionToken } from './defs';

export function ProvideCollection<T>(entity: Constructor<T>) {
  return {
    provide: getCollectionToken(entity),

    useFactory: (
      collectionsStorage: CollectionsStorage,
      databaseService: DatabaseService,
      eventManager: EventManagerService,
    ) => {
      const collection = new Collection(
        entity,
        collectionsStorage,
        databaseService,
        eventManager,
      );

      collectionsStorage.add(collection);

      return collection;
    },

    inject: [CollectionsStorage, DatabaseService, EventManagerService],
  } as Provider;
}
