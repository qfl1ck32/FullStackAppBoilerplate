import { Inject, Injectable } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Constructor } from '@root/defs';
import { EventManagerService } from '@root/event-manager/event-manager.service';

import { getBehaviours } from './collection.behaviours';
import { BehaviourFunction, CollectionRelations } from './collection.types';

import { getRelations } from '../database.decorators';
import { QueryBodyType, RelationArgs } from '../database.defs';
import { DatabaseService } from '../database.service';
import { DBContext, ObjectId } from '../defs';
import { AfterDeleteEvent } from '../events/after-delete.event';
import { AfterInsertEvent } from '../events/after-insert.event';
import { AfterUpdateEvent } from '../events/after-update.event';
import { BeforeDeleteEvent } from '../events/before-delete.event';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { BeforeUpdateEvent } from '../events/before-update.event';

import {
  DeleteOptions,
  Document,
  Filter,
  FindOptions,
  InsertOneOptions,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
} from 'mongodb';
import { Collection as BaseCollection } from 'mongoose';
import * as pluralize from 'pluralize';
import { Mixin, decorate } from 'ts-mixer';

export function createCollection<T>(entity: Constructor<T>) {
  @Injectable()
  class CollectionWrapper extends Collection {
    constructor(
      public readonly databaseService: DatabaseService,
      public readonly eventManager: EventManagerService,
    ) {
      super(entity, databaseService, eventManager);
    }
  }

  return CollectionWrapper as Constructor<Collection<T>>;
}

@Injectable()
export class Collection<T = any> extends BaseCollection<T> {
  private relations: CollectionRelations<T>;

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
    this.relations = {} as CollectionRelations<T>;

    this.loadBehaviours(behaviours);

    this.initialiseRelations(relations);
  }

  private loadBehaviours(behaviours: BehaviourFunction[]) {
    behaviours.forEach((behaviour) => behaviour(this));
  }

  private async initialiseRelations(relations: RelationArgs[]) {
    // TODO: validation, make sure the call doesn't return undefined

    for (const relation of relations) {
      const { isArray, to, inversedBy } = relation;

      const entity = to();

      this.relations[relation.field as keyof T] = {
        collectionName: getCollectionName(entity),
        isArray,
        inversedBy,
      };
    }
  }

  // TODO: we need to do this because of the types in "mongodb"... something about callbacks & deprecation & idk.
  // @ts-ignore
  async insertOne(
    document: Partial<OptionalUnlessRequiredId<T>>,
    options?: InsertOneOptions & DBContext,
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
  async findOne(filter: Filter<T>, options?: FindOptions<Document>) {
    return super.findOne(filter, options);
  }

  // @ts-ignore
  async updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options: UpdateOptions & DBContext,
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
  async deleteOne(filter: Filter<T>, options: DeleteOptions & DBContext) {
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

  private async queryOneRec<T>(body: QueryBodyType<T>, finalData: any) {
    for (const key in body) {
      const relation = this.relations[key as any];

      if (!relation) continue;

      const { collectionName, isArray } = relation;

      const collection =
        this.databaseService.connection.collection(collectionName);

      let result: any;

      const filters = {
        _id: finalData._id,
      } as Filter<T>;

      if (isArray) {
        result = await collection.find(filters).toArray();
      } else {
        result = await collection.findOne(filters);
      }

      finalData[key as any] = result;

      console.log({ key, finalData, body });

      await this.queryOneRec(body[key as any], finalData[key]);
    }
  }

  async queryOne(filters: Filter<T>, body: QueryBodyType<T>) {
    const data = await this.findOne(filters, body);

    let finalData = data;

    console.log(finalData);
    console.log('Start...');

    await this.queryOneRec(body, finalData);

    console.log(finalData);

    return data;
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
