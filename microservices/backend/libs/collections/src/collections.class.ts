import { Injectable } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Constructor } from '@app/core/defs';
import { DatabaseService } from '@app/database';
import { EventManagerService } from '@app/event-manager';

import { AfterDeleteEvent } from './events/after-delete.event';
import { AfterInsertEvent } from './events/after-insert.event';
import { AfterUpdateEvent } from './events/after-update.event';
import { BeforeDeleteEvent } from './events/before-delete.event';
import { BeforeInsertEvent } from './events/before-insert.event';
import { BeforeUpdateEvent } from './events/before-update.event';

import { getBehaviours } from './behaviours/utils';
import { getRelations } from './collections.decorators';
import {
  BehaviourFunction,
  CollectionRelationType,
  CollectionRelations,
  DBContext,
  ObjectId,
  QueryBodyType,
  RelationArgs,
} from './defs';

import {
  DeleteOptions,
  Document,
  Filter,
  FindOneAndDeleteOptions,
  FindOptions,
  InsertOneOptions,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
} from 'mongodb';
import { Collection as BaseCollection } from 'mongoose';
import * as pluralize from 'pluralize';
import { Mixin, decorate } from 'ts-mixer';

@Injectable()
export class Collection<T = any> extends BaseCollection<T> {
  private _relations: CollectionRelations<T>;

  constructor(
    public entity: Constructor<T>,
    public readonly databaseService: DatabaseService,
    public readonly eventManager: EventManagerService,
  ) {
    const behaviours = getBehaviours(entity);
    const relations = getRelations(entity);

    const name = getCollectionName(entity);

    super(name, databaseService.connection, {});

    // TODO: why "as"? can't TS infer that {} is a subtype of CollectionRelations<T>?
    this._relations = {} as CollectionRelations<T>;

    this._loadBehaviours(behaviours);

    this._initialiseRelations(relations);
  }

  public _loadBehaviours(behaviours: BehaviourFunction[]) {
    behaviours.forEach((behaviour) => behaviour(this));
  }

  public async _initialiseRelations(relations: RelationArgs[]) {
    // TODO: validation, make sure the call doesn't return undefined

    for (const relation of relations) {
      const { isArray, to, inversedBy } = relation;

      const entity = to();

      this._relations[relation.field as keyof T] = {
        collectionName: getCollectionName(entity),
        isArray,
        inversedBy,
      };
    }
  }

  async exists(filter: Filter<T>) {
    const count = await super.count(filter);

    return count > 0;
  }

  // TODO: we need to do this because of the types in "mongodb"... something about callbacks & deprecation & idk.
  // @ts-ignore
  async insertOne(
    document: Partial<OptionalUnlessRequiredId<T>>,
    options: InsertOneOptions & DBContext = {},
  ) {
    const { context, ...mongoOptions } = options;

    await this.eventManager.emit(
      new BeforeInsertEvent({
        collection: this,
        context,
        document: document,
      }),
    );

    const insertResult = await super.insertOne(document as any, mongoOptions);

    await this.eventManager.emit(
      new AfterInsertEvent({
        collection: this,
        context,
        document: document,
        insertResult,
      }),
    );

    return insertResult;
  }

  // @ts-ignore
  async findOne(filter: Filter<T>, options: FindOptions<Document> = {}) {
    return super.findOne(filter, options);
  }

  // @ts-ignore
  async findOneAndDelete(
    filter: Filter<T>,
    options: FindOneAndDeleteOptions & DBContext = {},
  ) {
    const { context, ...mongoOptions } = options;

    await this.eventManager.emit(
      new BeforeDeleteEvent({
        collection: this,
        context,
        filter,
      }),
    );

    const modifyResult = await super.findOneAndDelete(filter, mongoOptions);

    await this.eventManager.emit(
      new AfterDeleteEvent({
        collection: this,
        context,
        filter,

        // infered information
        deleteResult: {
          acknowledged: Boolean(modifyResult.ok),
          deletedCount: 1,
        },
      }),
    );

    return modifyResult;
  }

  // @ts-ignore
  async updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options: UpdateOptions & DBContext = {},
  ) {
    const { context, ...mongoOptions } = options;

    await this.eventManager.emit(
      new BeforeUpdateEvent({
        collection: this,
        context,
        filter,
        update,
      }),
    );

    const updateResult = await super.updateOne(filter, update, mongoOptions);

    await this.eventManager.emit(
      new AfterUpdateEvent({
        collection: this,
        context,
        filter,
        update,
        updateResult,
      }),
    );

    return updateResult;
  }

  // @ts-ignore
  async deleteOne(filter: Filter<T>, options: DeleteOptions & DBContext = {}) {
    const { context, ...mongoOptions } = options;

    await this.eventManager.emit(
      new BeforeDeleteEvent({
        collection: this,
        context,
        filter,
      }),
    );

    const deleteResult = await super.deleteOne(filter, mongoOptions);

    await this.eventManager.emit(
      new AfterDeleteEvent({
        collection: this,
        context,
        filter,
        deleteResult,
      }),
    );

    return deleteResult;
  }

  // TODO: types
  public async _queryOneRec<T>(body: QueryBodyType<T>, document: any) {
    for (const key in body) {
      const relation = this._relations[key as any] as CollectionRelationType<T>;

      if (!relation) continue;

      const { collectionName, isArray, inversedBy } = relation;

      console.log({ inversedBy });

      const collection =
        this.databaseService.connection.collection(collectionName);

      let result: any;

      const filters = {
        _id: document._id,
      } as Filter<T>;

      if (isArray) {
        result = await collection.find(filters).toArray();
      } else {
        result = await collection.findOne(filters);
      }

      document[key as any] = result;

      console.log({ key, finalData: document, body });

      await this._queryOneRec(body[key as any], document[key]);
    }
  }

  async queryOne(filters: Filter<T>, body: QueryBodyType<T>) {
    let document = await this.findOne(filters, body);

    if (document) {
      await this._queryOneRec(body, document);
    }

    return document;
  }
}

@decorate(ObjectType())
@decorate(Schema())
export class Entity {
  @decorate(Field(() => ID))
  @decorate(Prop())
  _id: ObjectId;
}

export const Mix = Mixin as any;

export function getCollectionName<T>(entity: Constructor<T>) {
  return pluralize(entity.name.toLowerCase());
}
