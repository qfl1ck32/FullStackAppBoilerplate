import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule, AuthService } from '@app/auth';
import { RegisterUserInput } from '@app/auth/dto/register.input';

import { UsersModule } from './users.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    }).compile();

    usersService = module.get(UsersService);
    resolver = module.get(UsersResolver);
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

    const userId = await authService.register(registerInput);

    const user = await usersService.collection.findOne({ _id: userId });

    const roles = await resolver.roles(user);

    expect(roles).not.toHaveLength(0);
  });
});
