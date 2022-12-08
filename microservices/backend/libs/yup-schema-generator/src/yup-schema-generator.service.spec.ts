import { Test, TestingModule } from '@nestjs/testing';
import { YupSchemaGeneratorService } from './yup-schema-generator.service';

describe('YupSchemaGeneratorService', () => {
  let service: YupSchemaGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YupSchemaGeneratorService],
    }).compile();

    service = module.get<YupSchemaGeneratorService>(YupSchemaGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
