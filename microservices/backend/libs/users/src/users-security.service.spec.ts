import { Test, TestingModule } from '@nestjs/testing';

import { UsersSecurityService } from './users-security.service';
import { UsersModule } from './users.module';

describe('UsersSecurityService', () => {
  let service: UsersSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    service = module.get<UsersSecurityService>(UsersSecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash & verify the password correctly', async () => {
    const password = 'hello';

    const hash = service.hashPassword(password);

    expect(service.isPasswordCorrect(hash, password)).toBe(true);
  });
});
