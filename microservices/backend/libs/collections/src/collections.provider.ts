import { Provider } from '@nestjs/common';

import { DatabaseService } from '@app/database';
import {
  EventManagerService,
  LocalEventManagerService,
} from '@app/event-manager';

import { Collection } from './collections';
import { CollectionsStorage } from './collections.storage';
import { CollectionEntities } from './defs';
import { getCollectionToken } from './utils';

export function ProvideCollection<DBEntityType, EntityType>(
  entities: CollectionEntities<DBEntityType, EntityType>,
) {
  const { relational: entity } = entities;

  return {
    provide: getCollectionToken(entity),

    useFactory: (
      collectionsStorage: CollectionsStorage,
      databaseService: DatabaseService,
      localEventManagerService: LocalEventManagerService,
      eventManagerService: EventManagerService,
    ) => {
      const collection = new Collection(
        entities,
        collectionsStorage,
        databaseService,
        localEventManagerService,
        eventManagerService,
      );

      collectionsStorage.add(collection);

      return collection;
    },

    inject: [
      CollectionsStorage,
      DatabaseService,
      LocalEventManagerService,
      EventManagerService,
    ],
  } as Provider;
}
