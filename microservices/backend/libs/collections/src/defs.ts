import { Constructor } from '@app/core/defs';

import { Collection } from './collections.class';

import { ObjectId } from 'bson';
import { FindOptions as BaseFindOptions, Document } from 'mongodb';
import 'mongoose';

export function getCollectionToken<T>(entity: Constructor<T>) {
  return `${entity.name}Collection`;
}

// MAGIC :)
declare module 'mongoose' {
  class Collection {
    constructor(name: string, conn: Connection, opts?: any);
  }
}

export { ObjectId };

export interface BlameableBehaviourOptions {
  throwErrorWhenMissing?: boolean;
}

export interface SoftdeletableBehaviourOptions {
  throwErrorWhenMissing?: boolean;
}

export interface TimestampableBehaviourOptions {}

export type AddBehaviourType<T = any> = (collection: Collection<T>) => void;

export type BehaviourFunction<T extends Document = any, OptionsType = any> = (
  options?: OptionsType,
) => AddBehaviourType<T>;

export type CollectionRelationType<T> = {
  entity: Constructor<T>;

  fieldId: string;

  isArray: boolean;

  inversedBy?: string;
};

export type CollectionRelations<T> = Record<keyof T, CollectionRelationType<T>>;

export type SimpleFieldValue = 1 | true;

export type Flatten<T> = T extends (infer U)[] ? U : T;

export type FindOptions = Pick<BaseFindOptions, 'skip' | 'limit' | 'sort'>;

export type QueryBodyType<T> = { _options?: FindOptions } & {
  [K in keyof T]?: T[K] extends string
    ? SimpleFieldValue
    : SimpleFieldValue | QueryBodyType<Flatten<T[K]>>;
};

export interface RelationArgs<From = any, To = any> {
  field: keyof From;

  fieldId?: keyof From;

  to: () => Constructor<To>;

  // MAGIC: we could've left "keyof To" as the type, but then
  // relation.inversedBy has type "string | symbol | idk"
  // this way, we get the best of both worlds - we have autocomplete from "to"
  // and we know that it's a string
  // maybe the solution would be to have <From = any, To extends ???? string ??= any>

  inversedBy?: keyof To extends string ? keyof To : string;

  isArray?: boolean;
}

export interface Reducer<T> {
  dependency: QueryBodyType<T>;
}

export interface Context {
  userId?: ObjectId;
}

export interface DBContext {
  context?: Context;
}
