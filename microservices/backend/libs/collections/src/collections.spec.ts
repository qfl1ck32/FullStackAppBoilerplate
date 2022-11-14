import { Schema } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@app/config';
import { Constructor } from '@app/core/defs';
import { DatabaseModule } from '@app/database';
import { EventManagerModule } from '@app/event-manager';

import { Collection, Entity } from './collections.class';
import { Relations } from './collections.decorators';
import { CollectionsModule } from './collections.module';
import { ProvideCollection } from './collections.provider';
import { ObjectId, getCollectionToken } from './defs';

const generateModule = async (entities: Constructor[]) => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      ConfigModule,
      EventManagerModule,
      CollectionsModule,
    ],

    providers: entities.map((entity) => ProvideCollection(entity)),
  }).compile();

  function getCollection<T>(entity: Constructor<T>) {
    return module.get<Collection<T>>(getCollectionToken(entity));
  }

  return { module, getCollection };
};

describe('Collections', () => {
  it('should insert a document', async () => {
    @Schema()
    class User extends Entity {
      firstName: string;
    }

    const { getCollection } = await generateModule([User]);

    const collection = getCollection(User);

    const result = await collection.insertOne({
      firstName: 'hi',
    });

    expect(result).toBeTruthy();

    expect(result.insertedId).toBeTruthy();
  });

  describe('Relations, simple queries', () => {
    @Schema()
    @Relations<User>()
      .add({
        field: 'comments',
        to: () => Comment,
        inversedBy: 'postedBy',
        isArray: true,
      })
      .add({
        field: 'address',
        to: () => Address,
        fieldId: 'addressId',
      })
      .build()
    class User extends Entity {
      firstName: string;

      comments: Comment[];

      addressId: ObjectId;

      address: Address;
    }

    @Schema()
    @Relations<Address>()
      .add({
        field: 'user',
        to: () => User,
        inversedBy: 'address',
      })
      .build()
    class Address extends Entity {
      street: string;

      user: User;
    }

    @Schema()
    @Relations<Comment>()
      .add({
        field: 'postedBy',
        fieldId: 'postedById',
        to: () => User,
      })
      .build()
    class Comment extends Entity {
      text: string;

      postedBy: User;
      postedById: ObjectId;
    }

    it('should work one level deep', async () => {
      const { getCollection } = await generateModule([User, Comment, Address]);

      const usersCollection = getCollection(User);

      const addressCollection = getCollection(Address);

      const commentsCollection = getCollection(Comment);

      const firstName = 'Andy';
      const street = 'Markov';
      const text = 'My message';

      const { insertedId: addressId } = await addressCollection.insertOne({
        street,
      });

      const { insertedId: userId } = await usersCollection.insertOne({
        firstName,
        addressId,
      });

      await commentsCollection.insertOne({
        text,
        postedById: userId,
      });

      await commentsCollection.insertOne({
        text,
        postedById: userId,
      });

      let user = await usersCollection.findOneRelational(
        {
          _id: userId,
        },
        {
          comments: {
            text: 1,
          },
        },
      );

      expect(user).toBeTruthy();
      expect(user.comments).toBeTruthy();
      expect(user.comments).toBeInstanceOf(Array);
      expect(user.comments).toHaveLength(2);

      user = await usersCollection.findOneRelational(
        {
          _id: userId,
        },
        {
          address: {
            street: 1,
          },
        },
      );

      expect(user.address).toBeTruthy();
      expect(user.address).toBeInstanceOf(Object);
    });

    it('should work with options one level deep', async () => {
      const { getCollection } = await generateModule([User, Comment]);

      const usersCollection = getCollection(User);

      const commentsCollection = getCollection(Comment);

      const firstName = 'Andy';

      const { insertedId: userId } = await usersCollection.insertOne({
        firstName,
      });

      const text = 'text';

      for (let i = 0; i < 5; ++i) {
        await commentsCollection.insertOne({
          text,
          postedById: userId,
        });
      }

      const userWithFirst2Comments = await usersCollection.findOneRelational(
        {
          _id: userId,
        },
        {
          comments: {
            _options: {
              limit: 2,
            },

            text: 1,
          },
        },
      );

      expect(userWithFirst2Comments).toBeTruthy();
      expect(userWithFirst2Comments.comments).toHaveLength(2);
    });

    it('should work two levels deep', async () => {
      const { getCollection } = await generateModule([User, Address, Comment]);

      const usersCollection = getCollection(User);

      const addressCollection = getCollection(Address);

      const commentsCollection = getCollection(Comment);

      const firstName = 'Andy';
      const street = 'Baker';
      const text = 'Hi';

      const { insertedId: addressId } = await addressCollection.insertOne({
        street,
      });

      const { insertedId: userId } = await usersCollection.insertOne({
        firstName,
        addressId,
      });

      await commentsCollection.insertOne({
        postedById: userId,
        text,
      });

      const user = await usersCollection.findOneRelational(
        {
          _id: userId,
        },
        {
          comments: {
            postedBy: {
              address: {
                street: 1,
              },
            },
          },
        },
      );

      expect(user.comments?.[0]?.postedBy?.address?.street).toBeTruthy();
    });

    it('should work with options two levels deep', async () => {
      const { getCollection } = await generateModule([User, Address, Comment]);

      const usersCollection = getCollection(User);

      const addressCollection = getCollection(Address);

      const commentsCollection = getCollection(Comment);

      const firstName = 'Andy';
      const street = 'Baker';
      const text = 'Hi';

      const { insertedId: addressId } = await addressCollection.insertOne({
        street,
      });

      const { insertedId: userId } = await usersCollection.insertOne({
        firstName,
        addressId,
      });

      for (let i = 0; i < 5; ++i) {
        await commentsCollection.insertOne({
          postedById: userId,
          text,
        });
      }

      const address = await addressCollection.findOneRelational(
        {
          _id: addressId,
        },
        {
          user: {
            comments: {
              _options: {
                limit: 2,
              },
            },
          },
        },
      );

      expect(address.user?.comments).toHaveLength(2);
    });
  });
});
