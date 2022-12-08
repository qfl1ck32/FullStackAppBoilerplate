import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the names of the class & method correctly', async () => {
    class TestClass {
      public testMethod() {
        const text = service.info('Hello');

        expect(text).toContain(TestClass.name);
        expect(text).toContain('testMethod');
      }
    }

    const myClass = new TestClass();

    myClass.testMethod();
  });
});
