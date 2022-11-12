import { Prop, Schema } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';

import { Entity, createCollection } from './collections.class';

describe('Collections', () => {
  @Schema()
  class User extends Entity {
    @Prop()
    firstName: string;
  }

  class UsersCollection extends createCollection(User) {}

  let collection: UsersCollection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ConfigModule],

      providers: [UsersCollection],
    }).compile();

    collection = module.get(UsersCollection);
  });

  it('should insert a document', async () => {
    const result = await collection.insertOne({
      firstName: 'hi',
    });

    expect(result).toBeTruthy();

    expect(result.insertedId).toBeTruthy();
  });
});
