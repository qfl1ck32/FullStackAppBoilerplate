import { Collection } from './collections.class';

import { Document } from 'mongodb';

export type BehaviourFunction<T extends Document = any> = (
  collection: Collection<T>,
) => void;

export type CollectionRelationType<T> = {
  collectionName: string;
  isArray: boolean;

  inversedBy?: string;
};

export type CollectionRelations<T> = Record<keyof T, CollectionRelationType<T>>;
