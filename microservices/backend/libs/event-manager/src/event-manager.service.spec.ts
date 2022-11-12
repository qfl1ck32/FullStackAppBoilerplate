import { Test, TestingModule } from '@nestjs/testing';

import { EventManagerService } from './event-manager.service';

describe('EventManagerService', () => {
  let service: EventManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventManagerService],
    }).compile();

    service = module.get<EventManagerService>(EventManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
