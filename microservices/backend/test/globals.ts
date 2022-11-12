import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseModule, DatabaseService } from '@app/database';

import 'jest';

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [DatabaseModule],
  }).compile();

  const databaseService = module.get(DatabaseService);

  await databaseService.clean();
});

afterEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [DatabaseModule],
  }).compile();

  const databaseService = module.get(DatabaseService);

  await databaseService.clean();
});
