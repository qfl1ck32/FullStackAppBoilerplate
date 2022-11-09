import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('clean()', async () => {
    const collections = ['test1', 'test2'].map((name) =>
      service.connection.db.collection(name),
    );

    for (const collection of collections) {
      await collection.insertOne({});

      expect(await collection.count({})).toBe(1);
    }

    await service.clean();

    for (const collection of collections) {
      expect(await collection.count({})).toBe(0);
    }
  });
});
