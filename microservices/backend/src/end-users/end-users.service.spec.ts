import { Test, TestingModule } from '@nestjs/testing';
import { EndUsersService } from './end-users.service';

describe('EndUsersService', () => {
  let service: EndUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EndUsersService],
    }).compile();

    service = module.get<EndUsersService>(EndUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
