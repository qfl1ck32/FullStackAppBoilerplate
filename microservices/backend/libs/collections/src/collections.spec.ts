import { Prop, Schema } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';

import { Collection, Entity } from './collections.class';
import { ProvideCollection } from './collections.provider';
import { getCollectionToken } from './defs';

describe('Collections', () => {
  @Schema()
  class User extends Entity {
    @Prop()
    firstName: string;
  }

  let collection: Collection<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ConfigModule],

      providers: [ProvideCollection(User)],
    }).compile();

    collection = module.get<Collection<User>>(getCollectionToken(User));
  });

  it('should insert a document', async () => {
    const result = await collection.insertOne({
      firstName: 'hi',
    });

    expect(result).toBeTruthy();

    expect(result.insertedId).toBeTruthy();
  });
});
