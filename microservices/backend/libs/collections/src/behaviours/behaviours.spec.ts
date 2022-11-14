import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@app/config';
import { Constructor } from '@app/core/defs';
import { DatabaseModule } from '@app/database';
import { EventManagerModule, EventManagerService } from '@app/event-manager';

import { Blameable } from './blameable.behaviour';
import { Softdeletable } from './softdeletable.behaviour';
import { Timestampable } from './timestampable.behaviour';

import { Collection } from '../collections.class';
import { ProvideCollection } from '../collections.provider';
import { CollectionEntities, ObjectId } from '../defs';
import { UserMissingException } from '../exceptions/user-missing.exception';
import { createEntity, getCollectionToken } from '../utils';

// TODO: make just one, for testing? somehow?
async function getCollectionAndEventManager<DatabaseEntity, RelationalEntity>(
  entities: CollectionEntities<DatabaseEntity, RelationalEntity>,
) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [DatabaseModule, ConfigModule, EventManagerModule],

    providers: [ProvideCollection(entities)],
  }).compile();

  const collection = module.get<Collection<DatabaseEntity, RelationalEntity>>(
    getCollectionToken(entities.relational),
  );

  const eventManager = module.get(EventManagerService);

  return { collection, eventManager };
}

// TODO: more tests, event manager, e.t.c.
describe('Behaviours', () => {
  it('should work with timestampable', async () => {
    class User extends Timestampable {
      firstName: string;
    }

    const UserEntity = createEntity({
      database: User,
    });

    const { collection } = await getCollectionAndEventManager(UserEntity);

    const result = await collection.insertOne({
      firstName: 'hi',
    });

    const { insertedId } = result;

    const document = await collection.findOne({ _id: insertedId });

    expect(document.createdAt).toBeTruthy();
    expect(document.updatedAt).toBeTruthy();
  });

  it('should work with softdeletable', async () => {
    class User extends Softdeletable {
      firstName: string;
    }
    const UserEntity = createEntity({
      database: User,
    });

    const { collection } = await getCollectionAndEventManager(UserEntity);

    const result = await collection.insertOne({
      firstName: 'hi',
    });

    const { insertedId } = result;

    await collection.deleteOne({ _id: insertedId });

    const document = await collection.findOne({
      _id: insertedId,
      isDeleted: true,
    });

    expect(document.deletedAt).toBeTruthy();
    expect(document.isDeleted).toBe(true);
  });

  it('should work with blameable', async () => {
    class User extends Blameable {
      firstName: string;
    }

    const UserEntity = createEntity({
      database: User,
    });

    const { collection } = await getCollectionAndEventManager(UserEntity);

    await expect(collection.insertOne({ firstName: 'Andy' })).rejects.toThrow(
      new UserMissingException(),
    );

    const userId = new ObjectId();

    const result = await collection.insertOne(
      {
        firstName: 'Andy',
      },
      {
        context: {
          userId,
        },
      },
    );

    const { insertedId } = result;

    const document = await collection.findOne({ _id: insertedId });

    expect(document.createdByUserId).toStrictEqual(userId);
  });
});
