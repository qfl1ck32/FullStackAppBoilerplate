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
import { CollectionsStorage } from './collections.storage';
import {
  AddBehaviourType,
  CollectionEntities,
  CollectionRelationType,
  CollectionRelations,
  DBContext,
  FindOptions,
  ObjectId,
  QueryBodyType,
  RelationArgs,
} from './defs';

import {
  DeleteOptions,
  Document,
  Filter,
  FindOneAndDeleteOptions,
  InsertOneOptions,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  WithId,
} from 'mongodb';
import { Collection as BaseCollection } from 'mongoose';
import * as pluralize from 'pluralize';
import { Mixin, decorate } from 'ts-mixer';

// TODO: add another type, like "DB Type", and same goes for all entities
// reason being, e.g. for insert, we don't want to see fields that are relations or reducers.
@Injectable()
export class Collection<
  DBEntity = any,
  Entity = DBEntity,
> extends BaseCollection<DBEntity> {
  private _relations: CollectionRelations<DBEntity>;

  constructor(
    public entities: CollectionEntities<DBEntity, Entity>,
    private collectionsStorage: CollectionsStorage,
    public readonly databaseService: DatabaseService,
    public readonly eventManager: EventManagerService,
  ) {
    const { relational: entity } = entities;

    const behaviours = getBehaviours(entity);
    const relations = getRelations(entity);

    const name = getCollectionName(entity);

    super(name, databaseService.connection, {});

    // TODO: why "as"? can't TS infer that {} is a subtype of CollectionRelations<T>?
    this._relations = {} as CollectionRelations<DBEntity>;

    this._loadBehaviours(behaviours);

    this._initialiseRelations(relations);
  }

  private _loadBehaviours(behaviours: AddBehaviourType[]) {
    behaviours.forEach((behaviour) => behaviour(this));
  }

  private async _initialiseRelations(relations: RelationArgs[]) {
    // TODO: validation, make sure the call doesn't return undefined

    for (const relation of relations) {
      const { isArray, to, inversedBy, field, fieldId } = relation;

      const entity = to();

      // TODO: types?
      this._relations[field as any] = {
        entity,
        isArray,
        inversedBy,
        fieldId,
      };
    }
  }

  async exists(filter: Filter<DBEntity>) {
    const count = await super.count(filter);

    return count > 0;
  }

  // TODO: we need to do this because of the types in "mongodb"... something about callbacks & deprecation & idk.
  // @ts-ignore
  async insertOne(
    document: Partial<OptionalUnlessRequiredId<DBEntity>>,
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

    // TODO: type
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
  async findOne(filter: Filter<DBEntity>, options: FindOptions = {}) {
    // @ts-ignore ??
    return super.findOne(filter, options) as WithId<DBEntity>;
  }

  // @ts-ignore
  public find(filter: Filter<DBEntity>, options: FindOptions = {}) {
    return super.find(filter, options);
  }

  // @ts-ignore
  async findOneAndDelete(
    filter: Filter<Entity>,
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

    // TODO: relatorelational filtering
    const modifyResult = await super.findOneAndDelete(
      filter as any,
      mongoOptions,
    );

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
    filter: Filter<Entity>,
    update: UpdateFilter<DBEntity>,
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

    // TODO: types
    const updateResult = await super.updateOne(
      filter as any,
      update,
      mongoOptions,
    );

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
  async deleteOne(
    filter: Filter<Entity>,
    options: DeleteOptions & DBContext = {},
  ) {
    const { context, ...mongoOptions } = options;

    await this.eventManager.emit(
      new BeforeDeleteEvent({
        collection: this,
        context,
        filter,
      }),
    );

    // TODO: types
    const deleteResult = await super.deleteOne(filter as any, mongoOptions);

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
  private async _findRelationalRec<T>(body: QueryBodyType<T>, document: any) {
    for (const key in body) {
      const relation = this._relations[key as any] as CollectionRelationType<T>;

      if (!relation) continue;

      const { entity, isArray, inversedBy, fieldId } = relation;

      const collection = this.collectionsStorage.get(entity);

      let result: any;

      const filters = {
        [inversedBy ?? '_id']: document[fieldId],
      } as Filter<T>;

      if (isArray) {
        result = await collection.query(filters, body[key as any]);
      } else {
        result = await collection.queryOne(filters, body[key as any]);
      }

      document[key as any] = result;

      await this._findRelationalRec(body[key as any], document[key as any]);
    }
  }

  async queryOne(filters: Filter<DBEntity>, body: QueryBodyType<Entity>) {
    let document = await this.findOne(filters, body._options);

    if (document) {
      await this._findRelationalRec(body, document);
    }

    // TODO: can we fix "as unknown"?
    return document as unknown as WithId<Entity>;
  }

  async query(filters: Filter<DBEntity>, body: QueryBodyType<DBEntity>) {
    // TODO: should use projection, theoretically
    // Or, if it's faster, just clean the query up after the result :)
    let documents = await this.find(filters, body._options).toArray();

    const promises = [];

    for (const document of documents) {
      promises.push(this._findRelationalRec(body, document));
    }

    await Promise.all(promises);

    return documents;
  }
}

@decorate(ObjectType())
@decorate(Schema())
export class Entity {
  @decorate(Field(() => ID))
  @decorate(Prop())
  _id: ObjectId;
}

export const Mix = Mixin;

export function getCollectionName<T>(entity: Constructor<T>) {
  return pluralize(entity.name.toLowerCase());
}
