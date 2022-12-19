import { Test, TestingModule } from '@nestjs/testing';

import { YupService } from './yup.service';

describe('YupService', () => {
  let service: YupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YupService],
    }).compile();

    service = module.get<YupService>(YupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
