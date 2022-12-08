import { Constructor } from '@app/core/defs';

import { CollectionEntities, QueryBodyType } from './defs';

export const MONGODB_QUERY_OPERATORS = {
  '$eq': 1,
  '$gte': 1,
  '$lte': 1,
  '$gt': 1,
  '$lt': 1,
  '$in': 1,
  '$ne': 1,
  '$nin': 1,
}

export function createEntity<DatabaseEntity, RelationalEntity = DatabaseEntity>(
  input: CollectionEntities<DatabaseEntity, RelationalEntity>,
) {
  const { database, relational } = input;

  return {
    database,
    relational: relational ?? database,
  } as CollectionEntities<DatabaseEntity, RelationalEntity>;
}

export function getCollectionToken<T>(entity: Constructor<T>) {
  return `${entity.name}Collection`;
}

export async function cleanDocument<T>(
  document: T,
  queryBody: QueryBodyType<T>,
) {
  for (const key in document) {
    if (key === '_id') continue;

    if (typeof document[key] === 'object') {
      if (!queryBody[key]) {
        delete document[key];

        continue;
      }

      // it doesn't infer that "key" is indeed a key for queryBody => "as any" :D
      return cleanDocument(document[key], queryBody[key as any]);
    }

    if (!queryBody[key]) {
      delete document[key];
    }
  }
}

export async function cleanDocuments<T>(
  documents: T[],
  queryBody: QueryBodyType<T>,
) {
  const promises = [];

  for (const document of documents) {
    promises.push(cleanDocument(document, queryBody));
  }

  await Promise.all(promises);
}
