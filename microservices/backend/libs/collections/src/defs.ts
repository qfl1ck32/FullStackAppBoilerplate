import { Constructor } from '@app/core/defs';

import { Collection } from './collections.class';

import { ObjectId } from 'bson';
import { Document } from 'mongodb';
import 'mongoose';

// MAGIC :)
declare module 'mongoose' {
  class Collection {
    constructor(name: string, conn: Connection, opts?: any);
  }
}

export { ObjectId };

export type BehaviourFunction<T extends Document = any> = (
  collection: Collection<T>,
) => void;

export type CollectionRelationType<T> = {
  collectionName: string;
  isArray: boolean;

  inversedBy?: string;
};

export type CollectionRelations<T> = Record<keyof T, CollectionRelationType<T>>;

export type SimpleFieldValue = 1 | true;

export type Flatten<T> = T extends (infer U)[] ? U : T;

export type QueryBodyType<T> = {
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

export interface Context {
  userId?: ObjectId;
}

export interface DBContext {
  context?: Context;
}
