import { Test, TestingModule } from '@nestjs/testing';
import { EndUsersResolver } from './end-users.resolver';

describe('EndUsersResolver', () => {
  let resolver: EndUsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EndUsersResolver],
    }).compile();

    resolver = module.get<EndUsersResolver>(EndUsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
