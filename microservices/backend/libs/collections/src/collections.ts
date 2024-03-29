import { Injectable } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Constructor } from '@app/core/defs';
import { DatabaseService } from '@app/database';
import {
  EventManagerService,
  LocalEventManagerService,
} from '@app/event-manager';
import { Language } from '@app/i18n/defs';

import { AfterDeleteEvent } from './events/after-delete.event';
import { AfterInsertEvent } from './events/after-insert.event';
import { AfterUpdateEvent } from './events/after-update.event';
import { BeforeDeleteEvent } from './events/before-delete.event';
import { BeforeInsertEvent } from './events/before-insert.event';
import { BeforeUpdateEvent } from './events/before-update.event';

import { getBehavioursWithOptions } from './behaviours/utils';
import { getRelations } from './collections.decorators';
import { CollectionsStorage } from './collections.storage';
import {
  BehaviourWithOptions,
  CollectionEntities,
  CollectionRelationType,
  CollectionRelations,
  DBContext,
  Filter,
  FindOptions,
  ObjectId,
  OptionalUnlessRequiredId,
  QueryBodyType,
  RelationArgs,
  ResolveTranslatableFieldsArgs,
  SimpleFilter,
  UpdateFilter,
} from './defs';
import { getTranslatableFields } from './translatable-fields/translatable-fields.decorators';
import { MONGODB_QUERY_OPERATORS, cleanDocuments } from './utils';

import {
  DeleteOptions,
  Document,
  FindCursor,
  FindOneAndDeleteOptions,
  InsertOneOptions,
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
> extends BaseCollection {
  public _relations: CollectionRelations<DBEntity>;
  public _translatableFields: Record<string, boolean>;

  constructor(
    public entities: CollectionEntities<DBEntity, Entity>,
    private collectionsStorage: CollectionsStorage,
    public readonly databaseService: DatabaseService,
    public readonly localEventManager: LocalEventManagerService,
    public readonly eventManager: EventManagerService,
  ) {
    const { relational: entity } = entities;

    const name = getCollectionName(entity);

    super(name, databaseService.connection, {});

    const behaviours = getBehavioursWithOptions(entity);
    const relations = getRelations(entity);

    const translatableFields = getTranslatableFields(entity);

    // TODO: why "as"? can't TS infer that {} is a subtype of CollectionRelations<T>?
    this._relations = {} as CollectionRelations<DBEntity>;

    this._translatableFields = {};

    this._loadBehaviours(behaviours);

    this._initialiseRelations(relations);

    this._initialiseTranslatableFields(translatableFields);
  }

  private _initialiseTranslatableFields(translatableFields: string[]) {
    for (const fieldName of translatableFields) {
      this._translatableFields[fieldName] = true;
    }
  }

  private _loadBehaviours(behaviours: BehaviourWithOptions[]) {
    behaviours.forEach((item) => item.behaviour(item.options)(this));
  }

  private async _initialiseRelations(relations: RelationArgs[]) {
    // TODO: validation, make sure the call doesn't return undefined

    for (const relation of relations) {
      const { isArray, to, inversedBy, field, fieldId } = relation;

      const entity = to();

      if (fieldId) {
        await this.createIndex([fieldId.toString()]);
      }

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

  private resolveTranslatableFieldsInput(args: ResolveTranslatableFieldsArgs) {
    const { document, options, isFind, isUpdate } = args;

    const language = options?.context?.language;

    for (const fieldName in document) {
      if (!this._translatableFields[fieldName]) {
        continue;
      }

      if (typeof document[fieldName] === 'object') {
        let isOk = false;

        for (const language of Object.values(Language)) {
          if (document[fieldName][language]) {
            isOk = true;

            break;
          }
        }

        if (isOk) {
          continue;
        }
      }

      if (isUpdate && !language) {
        throw new Error(
          `Cannot update translatable field directly to a string without language specified`,
        );
      }

      if (isFind || isUpdate) {
        const value = document[fieldName];

        delete document[fieldName];

        if (!language) {
          const $or = document['$or'] || [];

          for (const language of Object.values(Language)) {
            $or.push({
              [`${fieldName}.${language}`]: value,
            });
          }

          document['$or'] = $or;

          continue;
        }

        document[`${fieldName}.${language}`] = value;
      } else {
        (document[fieldName] as any) = {
          [language]: document[fieldName],
        };
      }
    }
  }

  private resolveTranslatableFieldsOutput(document: any, options?: DBContext) {
    const language = options?.context?.language;

    for (const fieldName in this._translatableFields) {
      if (document[fieldName]) {
        document[fieldName] = document[fieldName][language];
      }
    }
  }

  // TODO: we need to do this because of the types in "mongodb"... something about callbacks & deprecation & idk.
  // @ts-ignore
  async insertOne(
    document: Partial<OptionalUnlessRequiredId<DBEntity>>,
    options: InsertOneOptions & DBContext = {},
  ) {
    const { context, ...mongoOptions } = options;

    this.resolveTranslatableFieldsInput({ document, options });

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
  async findOne(filter: Filter<DBEntity>, options: FindOptions = {}) {
    this.resolveTranslatableFieldsInput({
      document: filter,
      options,
      isFind: true,
    });

    const doc = (await super.findOne(filter, options)) as DBEntity;

    if (doc && options?.context?.language) {
      this.resolveTranslatableFieldsOutput(doc, options);
    }

    return doc;
  }

  // @ts-ignore
  public find(filter: Filter<DBEntity>, options: FindOptions = {}) {
    this.resolveTranslatableFieldsInput({
      document: filter,
      options,
      isFind: true,
    });

    const result = super.find(filter, options);

    const originalToArray = result.toArray.bind(result);

    result.toArray = async () => {
      const items = await originalToArray();

      for (const item of items) {
        if (options?.context?.language) {
          this.resolveTranslatableFieldsOutput(item, options);
        }
      }

      return items;
    };

    return result as FindCursor<WithId<DBEntity>>;
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

    // TODO: relational filtering
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

    this.resolveTranslatableFieldsInput({
      document: update['$set'],
      options,
      isUpdate: true,
    });

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
  private async _queryRec<T>(body: QueryBodyType<T>, document: any) {
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

      await this._queryRec(body[key as any], document[key as any]);
    }
  }

  async queryOne(
    filters: Filter<DBEntity>,
    body: QueryBodyType<Entity>,
    options?: FindOptions,
  ) {
    let document = await this.findOne(filters, options);

    if (document) {
      await this._queryRec(body, document);
    }

    // TODO: can we fix "as unknown"?
    return document as unknown as WithId<Entity>;
  }

  async query(
    filters: Filter<DBEntity>,
    body: QueryBodyType<Entity>,
    options?: FindOptions,
  ) {
    // TODO: should use projection, theoretically
    // Or, if it's faster, just clean the query up after the result :)
    let documents = await this.find(filters, options).toArray();

    const promises = [];

    for (const document of documents) {
      promises.push(this._queryRec(body, document));
    }

    await Promise.all(promises);

    return documents;
  }

  // TODO: types
  async _queryRelationalRec(
    filters: SimpleFilter<Entity>,
    currentPath: string[],
    pipeline: Document[],
    collection: Collection,
  ) {
    for (const field in filters) {
      let currentFieldName = currentPath.join('.');

      if (currentFieldName) {
        currentFieldName += '.';
      }

      const value = filters[field] as any;

      const key = Object.keys(value)[0];

      if (
        typeof value !== 'object' ||
        value instanceof ObjectId ||
        MONGODB_QUERY_OPERATORS[key]
      ) {
        pipeline.push({
          $match: {
            [`${currentFieldName}${field}`]: value,
          },
        });

        continue;
      }

      const relation = collection._relations[field] as CollectionRelationType;

      if (relation) {
        const { entity, fieldId, isArray, inversedBy } = relation;

        const documents = [] as Document[];

        if (fieldId) {
          const as = `${currentFieldName}${field}`;

          documents.push({
            $lookup: {
              from: getCollectionName(entity),
              localField: `${currentFieldName}${fieldId}`,
              foreignField: `_id`,
              as,

              pipeline: [
                {
                  $project: {
                    [`${as}._id`]: 1,
                  },
                },
              ],
            },
          });
        } else if (inversedBy) {
          const inversedCollection = this.collectionsStorage.get(entity);

          const inversedRelation =
            inversedCollection._relations[relation.inversedBy];

          const foreignField = `${inversedRelation.fieldId}`;
          const as = `${currentFieldName}${field}`;

          documents.push({
            $lookup: {
              from: getCollectionName(entity),
              localField: `${currentFieldName}_id`,
              foreignField,
              as,

              pipeline: [
                {
                  $project: {
                    [`${as}.${foreignField}`]: 1,
                  },
                },
              ],
            },
          });
        }

        // TODO: this can fasten things up if deleted Ig
        if (!isArray) {
          documents.push({
            $unwind: {
              path: `$${currentFieldName}${field}`,
            },
          });
        }

        pipeline.push(...documents);

        await this._queryRelationalRec(
          value,
          currentPath.concat(field),
          pipeline,
          this.collectionsStorage.get(entity),
        );
      }
    }
  }

  async queryRelational(
    filters: SimpleFilter<Entity>,
    body: QueryBodyType<Entity>,
  ) {
    const pipeline: Document[] = [];

    await this._queryRelationalRec(filters, [], pipeline, this);

    const documents = await this.aggregate(pipeline).toArray();

    const promises = [];

    for (const document of documents) {
      promises.push(this._queryRec(body, document));
    }

    await Promise.all(promises);

    await cleanDocuments(documents, body);

    return documents as Entity[];
  }

  async queryOneRelational(
    filters: SimpleFilter<Entity>,
    body: QueryBodyType<Entity>,
  ) {
    const results = await this.queryRelational(filters, body);

    return results[0];
  }
}

@decorate(ObjectType())
@decorate(Schema())
export class Entity {
  @decorate(Field(() => ID))
  @decorate(Prop())
  _id: ObjectId;
}

export const Combine = Mixin;

export function getCollectionName<T>(entity: Constructor<T>) {
  return pluralize(entity.name.toLowerCase());
}
