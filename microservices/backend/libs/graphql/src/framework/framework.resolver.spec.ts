import { Test, TestingModule } from '@nestjs/testing';
import { FrameworkResolver } from './framework.resolver';

describe('FrameworkResolver', () => {
  let resolver: FrameworkResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrameworkResolver],
    }).compile();

    resolver = module.get<FrameworkResolver>(FrameworkResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
