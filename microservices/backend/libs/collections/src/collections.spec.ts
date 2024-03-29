import { Schema } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { EventManagerModule } from '@app/event-manager';
import { Language } from '@app/i18n/defs';

import { Timestampable } from './behaviours/timestampable.behaviour';
import { Collection, Combine, Entity } from './collections';
import { Relations } from './collections.decorators';
import { CollectionsModule } from './collections.module';
import { ProvideCollection } from './collections.provider';
import { CollectionsStorage } from './collections.storage';
import { CollectionEntities, ObjectId } from './defs';
import { TranslatableField } from './translatable-fields/translatable-fields';
import {
  Translatable,
  getTranslatableFields,
} from './translatable-fields/translatable-fields.decorators';
import { createEntity, getCollectionToken } from './utils';

import { performance } from 'node:perf_hooks';

const generateModule = async (entities: CollectionEntities[]) => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      ConfigModule,
      EventManagerModule,
      CollectionsModule,
    ],

    providers: entities.map((entity) => ProvideCollection(entity)),
  }).compile();

  function getCollection<DBEntityType, EntityType>(
    entities: CollectionEntities<DBEntityType, EntityType>,
  ) {
    return module.get<Collection<DBEntityType, EntityType>>(
      getCollectionToken(entities.relational),
    );
  }

  return { module, getCollection };
};

describe.only('Collections', () => {
  it('should insert a document', async () => {
    @Schema()
    class User extends Entity {
      firstName: string;
    }

    const UserEntity = createEntity({
      database: User,
    });

    const { getCollection } = await generateModule([UserEntity]);

    const collection = getCollection(UserEntity);

    const result = await collection.insertOne({
      firstName: 'hi',
    });

    expect(result).toBeTruthy();

    expect(result.insertedId).toBeTruthy();
  });

  // describe.skip('Relations, simple queries', () => {
  //   class DBUser extends Entity {
  //     firstName: string;

  //     addressId: ObjectId;
  //   }

  //   @Schema()
  //   @Relations<User>()
  //     .add({
  //       field: 'comments',
  //       to: () => Comment,
  //       inversedBy: 'postedBy',
  //       isArray: true,
  //     })
  //     .add({
  //       field: 'address',
  //       to: () => Address,
  //       fieldId: 'addressId',
  //     })
  //     .build()
  //   class User extends Mix(DBUser, Timestampable) {
  //     comments: Comment[];
  //     address: Address;
  //   }

  //   class DBAddress {
  //     street: string;
  //   }

  //   @Schema()
  //   @Relations<Address>()
  //     .add({
  //       field: 'user',
  //       to: () => User,
  //       inversedBy: 'address',
  //     })
  //     .build()
  //   class Address extends Mix(DBAddress, Entity) {
  //     user: User;
  //   }

  //   class DBComment {
  //     text: string;
  //     postedById: ObjectId;
  //   }

  //   @Schema()
  //   @Relations<Comment>()
  //     .add({
  //       field: 'postedBy',
  //       fieldId: 'postedById',
  //       to: () => User,
  //     })
  //     .build()
  //   class Comment extends Mix(DBComment, Entity) {
  //     postedBy: User;
  //   }

  //   const UserEntity = createEntity({
  //     database: DBUser,
  //     relational: User,
  //   });

  //   const CommentEntity = createEntity({
  //     database: DBComment,
  //     relational: Comment,
  //   });

  //   const AddressEntity = createEntity({
  //     database: DBAddress,
  //     relational: Address,
  //   });

  //   it('should work one level deep', async () => {
  //     const { getCollection } = await generateModule([
  //       UserEntity,
  //       CommentEntity,
  //       AddressEntity,
  //     ]);

  //     const usersCollection = getCollection(UserEntity);

  //     const addressCollection = getCollection(AddressEntity);

  //     const commentsCollection = getCollection(CommentEntity);

  //     const firstName = 'Andy';
  //     const street = 'Markov';
  //     const text = 'My message';

  //     const { insertedId: addressId } = await addressCollection.insertOne({
  //       street,
  //     });

  //     const { insertedId: userId } = await usersCollection.insertOne({
  //       firstName,
  //       addressId,
  //     });

  //     await commentsCollection.insertOne({
  //       text,
  //       postedById: userId,
  //     });

  //     await commentsCollection.insertOne({
  //       text,
  //       postedById: userId,
  //     });

  //     let user = await usersCollection.queryOne(
  //       {
  //         _id: userId,
  //       },
  //       {
  //         comments: {
  //           text: 1,
  //         },
  //       },
  //     );

  //     expect(user).toBeTruthy();
  //     expect(user.comments).toBeTruthy();
  //     expect(user.comments).toBeInstanceOf(Array);
  //     expect(user.comments).toHaveLength(2);

  //     user = await usersCollection.queryOne(
  //       {
  //         _id: userId,
  //       },
  //       {
  //         address: {
  //           street: 1,
  //         },
  //       },
  //     );

  //     expect(user.address).toBeTruthy();
  //     expect(user.address).toBeInstanceOf(Object);
  //   });

  //   it('should work with options one level deep', async () => {
  //     const { getCollection } = await generateModule([
  //       UserEntity,
  //       CommentEntity,
  //     ]);

  //     const usersCollection = getCollection(UserEntity);

  //     const commentsCollection = getCollection(CommentEntity);

  //     const firstName = 'Andy';

  //     const { insertedId: userId } = await usersCollection.insertOne({
  //       firstName,
  //     });

  //     const text = 'text';

  //     for (let i = 0; i < 5; ++i) {
  //       await commentsCollection.insertOne({
  //         text,
  //         postedById: userId,
  //       });
  //     }

  //     const userWithFirst2Comments = await usersCollection.queryOne(
  //       {
  //         _id: userId,
  //       },
  //       {
  //         comments: {
  //           text: 1,
  //         },
  //       },
  //       {
  //         limit: 2,
  //       },
  //     );

  //     expect(userWithFirst2Comments).toBeTruthy();
  //     expect(userWithFirst2Comments.comments).toHaveLength(2);
  //   });

  //   it('should work two levels deep', async () => {
  //     const { getCollection } = await generateModule([
  //       UserEntity,
  //       CommentEntity,
  //       AddressEntity,
  //     ]);

  //     const usersCollection = getCollection(UserEntity);

  //     const addressCollection = getCollection(AddressEntity);

  //     const commentsCollection = getCollection(CommentEntity);

  //     const firstName = 'Andy';
  //     const street = 'Baker';
  //     const text = 'Hi';

  //     const { insertedId: addressId } = await addressCollection.insertOne({
  //       street,
  //     });

  //     const { insertedId: userId } = await usersCollection.insertOne({
  //       firstName,
  //       addressId,
  //     });

  //     await commentsCollection.insertOne({
  //       postedById: userId,
  //       text,
  //     });

  //     const user = await usersCollection.queryOne(
  //       {
  //         _id: userId,
  //       },
  //       {
  //         comments: {
  //           postedBy: {
  //             address: {
  //               street: 1,
  //             },
  //           },
  //         },
  //       },
  //     );

  //     expect(user.comments?.[0]?.postedBy?.address?.street).toBeTruthy();
  //   });

  //   it('should work with options two levels deep', async () => {
  //     const { getCollection } = await generateModule([
  //       UserEntity,
  //       CommentEntity,
  //       AddressEntity,
  //     ]);

  //     const usersCollection = getCollection(UserEntity);

  //     const addressCollection = getCollection(AddressEntity);

  //     const commentsCollection = getCollection(CommentEntity);

  //     const firstName = 'Andy';
  //     const street = 'Baker';
  //     const text = 'Hi';

  //     const { insertedId: addressId } = await addressCollection.insertOne({
  //       street,
  //     });

  //     const { insertedId: userId } = await usersCollection.insertOne({
  //       firstName,
  //       addressId,
  //     });

  //     for (let i = 0; i < 5; ++i) {
  //       await commentsCollection.insertOne({
  //         postedById: userId,
  //         text,
  //       });
  //     }

  //     // const address = await addressCollection.findOneRelational(
  //     //   {
  //     //     _id: addressId,
  //     //   },
  //     //   {
  //     //     user: {
  //     //       comments: {
  //     //         _options: {
  //     //           limit: 2,
  //     //         },
  //     //       },
  //     //     },
  //     //   },
  //     // );

  //     // expect(address.user?.comments).toHaveLength(2);
  //   });

  //   it('should work with relational filtering', async () => {
  //     const { getCollection } = await generateModule([
  //       UserEntity,
  //       CommentEntity,
  //       AddressEntity,
  //     ]);

  //     const usersCollection = getCollection(UserEntity);

  //     const addressCollection = getCollection(AddressEntity);

  //     const commentsCollection = getCollection(CommentEntity);

  //     const firstName = 'Andy';

  //     const street = 'Baker';
  //     const street2 = 'Baker 2';
  //     const text = 'hi';

  //     const { insertedId: addressId } = await addressCollection.insertOne({
  //       street,
  //     });

  //     const { insertedId: addressId2 } = await addressCollection.insertOne({
  //       street: street2,
  //     });

  //     const { insertedId: userId } = await usersCollection.insertOne({
  //       firstName,
  //       addressId,
  //     });

  //     const { insertedId: userId2 } = await usersCollection.insertOne({
  //       firstName,
  //       addressId: addressId2,
  //     });

  //     await commentsCollection.insertOne({
  //       text,
  //       postedById: userId,
  //     });

  //     await commentsCollection.insertOne({
  //       text,
  //       postedById: userId2,
  //     });

  //     const result = await usersCollection.queryRelational(
  //       {
  //         address: {
  //           user: {
  //             _id: {
  //               $in: [userId],
  //             },
  //           },
  //         },
  //       },
  //       {
  //         _id: 1,

  //         firstName: 1,

  //         address: {
  //           street: 1,
  //         },
  //       },
  //     );

  //     expect(result).toStrictEqual([
  //       {
  //         _id: userId,
  //         firstName,

  //         address: {
  //           _id: addressId,
  //           street,
  //         },
  //       },
  //     ]);
  //   });

  //   it('should have good times, lol', async () => {
  //     const { getCollection } = await generateModule([
  //       UserEntity,
  //       CommentEntity,
  //       AddressEntity,
  //     ]);

  //     const usersCollection = getCollection(UserEntity);

  //     const addressCollection = getCollection(AddressEntity);

  //     const commentsCollection = getCollection(CommentEntity);

  //     const firstName = 'Andy';

  //     const street = 'Baker';
  //     const street2 = 'Baker 2';
  //     const text = 'hi';

  //     const { insertedId: addressId } = await addressCollection.insertOne({
  //       street,
  //     });

  //     const { insertedId: addressId2 } = await addressCollection.insertOne({
  //       street: street2,
  //     });

  //     const { insertedId: userId } = await usersCollection.insertOne({
  //       firstName,
  //       addressId,
  //     });

  //     const { insertedId: userId2 } = await usersCollection.insertOne({
  //       firstName,
  //       addressId: addressId2,
  //     });

  //     await commentsCollection.insertOne({
  //       text,
  //       postedById: userId,
  //     });

  //     await commentsCollection.insertOne({
  //       text,
  //       postedById: userId2,
  //     });

  //     const times = [];

  //     for (let i = 0; i < 200; ++i) {
  //       const startTime = performance.now();

  //       const result = await usersCollection.queryRelational(
  //         {
  //           address: {
  //             user: {
  //               _id: {
  //                 $in: [userId],
  //               },
  //             },
  //           },
  //         },
  //         {
  //           _id: 1,

  //           firstName: 1,

  //           address: {
  //             street: 1,
  //           },
  //         },
  //       );

  //       const endTime = performance.now();

  //       times.push(endTime - startTime);
  //     }

  //     const timesMean =
  //       times.reduce((prev, curr) => prev + curr, 0) / times.length;

  //     console.log({ times, timesMean });
  //   });
  // });

  it.only('should work with translatable fields', async () => {
    class DBTestCollection {
      @Translatable() // TODO: would be the best if we could get rid of this decorator
      myField: TranslatableField;

      someInteger: number;
    }

    const TestCollectionEntity = createEntity({
      database: DBTestCollection,
    });

    const { getCollection, module } = await generateModule([
      TestCollectionEntity,
    ]);

    const testCollection = getCollection(TestCollectionEntity);

    const { insertedId } = await testCollection.insertOne(
      {
        myField: 'salut',
      },
      {
        context: {
          language: Language.ro,
        },
      },
    );

    let doc = await testCollection.findOne({
      _id: insertedId,
    });

    expect(doc.myField).toStrictEqual({
      [Language.ro]: 'salut',
    });

    await testCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          myField: 'hello',
        },
      },
      {
        context: {
          language: Language.en,
        },
      },
    );

    doc = await testCollection.findOne({ _id: insertedId });

    expect(doc.myField).toStrictEqual({
      [Language.ro]: 'salut',
      [Language.en]: 'hello',
    });

    await testCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          myField: {
            en: 'new',
            ro: 'nou',
          },
        },
      },
    );

    doc = await testCollection.findOne({ _id: insertedId });

    expect(doc.myField).toStrictEqual({
      [Language.en]: 'new',
      [Language.ro]: 'nou',
    });

    doc = await testCollection.findOne(
      {
        myField: 'nou',
      },
      {
        context: {
          language: Language.en,
        },
      },
    );

    expect(doc).toBeFalsy();

    doc = await testCollection.findOne(
      {
        myField: 'nou',
      },
      {
        context: {
          language: Language.ro,
        },
      },
    );

    expect(doc).toBeTruthy();
    expect(doc.myField).toBe('nou');

    doc = await testCollection.findOne({
      myField: {
        $in: ['nah', 'nou'],
      },
    });

    // When it doesn't have a context, it should return all the languages
    expect(doc.myField).toStrictEqual({
      [Language.en]: 'new',
      [Language.ro]: 'nou',
    });

    let docs = await testCollection
      .find(
        {
          myField: 'nou',
        },
        {
          context: {
            language: Language.en,
          },
        },
      )
      .toArray();

    expect(docs).toHaveLength(0);

    docs = await testCollection
      .find(
        {
          myField: 'nou',
        },
        {
          context: {
            language: Language.ro,
          },
        },
      )
      .toArray();

    expect(docs).toHaveLength(1);

    expect(docs[0].myField).toBe('nou');

    doc = await testCollection.queryOne(
      {
        myField: 'nou',
      },
      {
        myField: 1,
      },
      {
        context: {
          language: Language.ro,
        },
      },
    );

    expect(doc.myField).toBe('nou');

    docs = await testCollection.query(
      {
        myField: 'new',
      },
      {
        myField: 1,
      },
      {
        context: {
          language: Language.en,
        },
      },
    );

    console.log(docs);
  });
});
