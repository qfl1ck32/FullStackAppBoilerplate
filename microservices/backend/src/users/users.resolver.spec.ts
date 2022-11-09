import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from '@root/auth/auth.module';
import { AuthService } from '@root/auth/auth.service';
import { RegisterUserInput } from '@root/auth/dto/register.input';

import { UsersModule } from './users.module';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  test('roles()', async () => {
    const registerInput = {
      firstName: 'firstName',
      lastName: 'lastName',
      username: 'qfl1ck32',
      email: 'qfl1ck32@yahoo.com',
      password: 'password',
    } as RegisterUserInput;

    const user = await authService.register(registerInput);

    const roles = await resolver.roles(user);

    expect(roles).not.toHaveLength(0);
  });
});
