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
import { ObjectId, getCollectionToken } from '../defs';
import { UserMissingException } from '../exceptions/user-missing.exception';

async function getCollectionAndEventManager<T>(entity: Constructor<T>) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [DatabaseModule, ConfigModule, EventManagerModule],

    providers: [ProvideCollection(entity)],
  }).compile();

  const collection = module.get<Collection<T>>(getCollectionToken(entity));

  const eventManager = module.get(EventManagerService);

  return { collection, eventManager };
}

// TODO: more tests, event manager, e.t.c.
describe('Behaviours', () => {
  it('should work with timestampable', async () => {
    class User extends Timestampable {
      firstName: string;
    }
    const { collection } = await getCollectionAndEventManager(User);

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

    const { collection } = await getCollectionAndEventManager(User);

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
    const { collection } = await getCollectionAndEventManager(User);

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
