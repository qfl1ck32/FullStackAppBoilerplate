import { Constructor } from '@app/core/defs';

import type { Blameable } from './behaviours/blameable.behaviour';
import type { Softdeletable } from './behaviours/softdeletable.behaviour';
import type { Timestampable } from './behaviours/timestampable.behaviour';
import { Collection } from './collections.class';

import { ObjectId } from 'bson';
import {
  BSONRegExp,
  BSONType,
  BSONTypeAlias,
  FindOptions as BaseFindOptions,
  BitwiseFilter,
  Document,
} from 'mongodb';
import 'mongoose';

export interface CollectionEntities<
  DatabaseEntity = any,
  RelationalEntity = DatabaseEntity,
> {
  database: Constructor<DatabaseEntity>;
  relational?: Constructor<RelationalEntity>;
}

// MAGIC :)
declare module 'mongoose' {
  class Collection {
    constructor(name: string, conn: Connection, opts?: any);
  }
}

export { ObjectId };

export interface BlameableBehaviourOptions {
  shouldThrowErrorWhenMissingUserId?: boolean;
}

export interface SoftdeletableBehaviourOptions {
  shouldThrowErrorWhenMissingUserId?: boolean;
}

export interface TimestampableBehaviourOptions {}

export type BehaviourOptions<T> = T extends Blameable
  ? BlameableBehaviourOptions
  : T extends Softdeletable
  ? SoftdeletableBehaviourOptions
  : T extends Timestampable
  ? TimestampableBehaviourOptions
  : null;

export type AddBehaviourType<T = any> = (collection: Collection<T>) => void;

export type BehaviourWithOptions<T = any> = {
  behaviour: BehaviourFunction<T>;
  options?: BehaviourOptions<T>;
};

export type BehaviourFunction<T extends Document = any, OptionsType = any> = (
  options?: OptionsType,
) => AddBehaviourType<T>;

export type CollectionRelationType<T = any> = {
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
  [K in keyof T]?: T[K] extends string | number
    ? SimpleFieldValue
    : QueryBodyType<Flatten<T[K]>>;
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

export declare interface FilterOperators<TValue> {
  $eq?: TValue;
  $gt?: TValue;
  $gte?: TValue;
  $in?: ReadonlyArray<TValue>;
  $lt?: TValue;
  $lte?: TValue;
  $ne?: TValue;
  $nin?: ReadonlyArray<TValue>;
  $not?: TValue extends string
    ? FilterOperators<TValue> | RegExp
    : FilterOperators<TValue>;
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean;
  $type?: BSONType | BSONTypeAlias;
  $expr?: Record<string, any>;
  $jsonSchema?: Record<string, any>;
  $mod?: TValue extends number ? [number, number] : never;
  $regex?: TValue extends string ? RegExp | BSONRegExp | string : never;
  $options?: TValue extends string ? string : never;
  $geoIntersects?: {
    $geometry: Document;
  };
  $geoWithin?: Document;
  $near?: Document;
  $nearSphere?: Document;
  $maxDistance?: number;
  $all?: ReadonlyArray<any>;
  $elemMatch?: Document;
  $size?: TValue extends ReadonlyArray<any> ? number : never;
  $bitsAllClear?: BitwiseFilter;
  $bitsAllSet?: BitwiseFilter;
  $bitsAnyClear?: BitwiseFilter;
  $bitsAnySet?: BitwiseFilter;
  $rand?: Record<string, never>;
}

export declare type SimpleFilter<TSchema> = TSchema extends
  | string
  | number
  | Date
  | ObjectId
  ? FilterOperators<TSchema> | TSchema
  : {
      [Property in keyof TSchema]?: TSchema[Property] extends (infer _)[]
        ? SimpleFilter<Flatten<TSchema[Property]>>
        : SimpleFilter<TSchema[Property]>;
    };
