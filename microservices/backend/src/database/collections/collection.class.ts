import { Provider } from '@nestjs/common';

import { Constructor } from '@root/defs';
import { EventManagerService } from '@root/event-manager/event-manager.service';

import { DatabaseService } from '../database.service';
import { DBContext } from '../defs';
import { AfterDeleteEvent } from '../events/after-delete.event';
import { AfterInsertEvent } from '../events/after-insert.event';
import { AfterUpdateEvent } from '../events/after-update.event';
import { BeforeDeleteEvent } from '../events/before-delete.event';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { BeforeUpdateEvent } from '../events/before-update.event';

import { BehaviourFunction, getBehaviours } from './collection.behaviours';
import {
  DeleteOptions,
  Filter,
  InsertOneOptions,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
} from 'mongodb';
import { Collection as BaseCollection } from 'mongoose';
import * as pluralize from 'pluralize';

export class Collection<T = any> extends BaseCollection<T> {
  constructor(
    name: string,
    behaviours: BehaviourFunction[],
    public readonly databaseService: DatabaseService,
    public readonly eventManager: EventManagerService,
  ) {
    super(name, databaseService.connection, {});

    this.loadBehaviours(behaviours);
  }

  private loadBehaviours(behaviours: BehaviourFunction[]) {
    behaviours.forEach((behaviour) => behaviour(this));
  }

  // TODO: we need to do this because of the types in "mongodb"... something about callbacks & deprecation & idk.
  // @ts-ignore
  async insertOne(
    document: OptionalUnlessRequiredId<T>,
    options?: InsertOneOptions & DBContext,
  ) {
    const { context, ...mongoOptions } = options;

    await this.eventManager.emit(
      new BeforeInsertEvent({
        collection: this,
        context,
        document,
      }),
    );

    const insertResult = await super.insertOne(document, mongoOptions);

    await this.eventManager.emit(
      new AfterInsertEvent({
        collection: this,
        context,
        document,
        insertResult,
      }),
    );

    return insertResult;
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
}

export function CollectionProvider(modelClass: Constructor<any>) {
  const name = modelClass.name;

  return {
    provide: `${name}sCollection`,
    useFactory: (
      databaseService: DatabaseService,
      eventManager: EventManagerService,
    ) => {
      const behaviours = getBehaviours(modelClass);

      return new Collection(
        pluralize(name.toLowerCase()),
        behaviours,
        databaseService,
        eventManager,
      );
    },

    inject: [DatabaseService, EventManagerService],
  } as Provider;
}
