import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseModule } from '@root/database/database.module';
import { DatabaseService } from '@root/database/database.service';

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
