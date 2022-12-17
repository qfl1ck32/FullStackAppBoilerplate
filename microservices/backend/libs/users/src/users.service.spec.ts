import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseModule } from '@app/database';

import { CreateUserInput } from './dto/create.input';

import { UserAlreadyExistsException } from './exceptions/UserAlreadyExists.exception';

import { UserPassword } from './users.class';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, DatabaseModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('create() - does not require e-mail validation', async () => {
    const input = {
      email: 'test@gmail.com',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
      username: 'username',

      requiresEmailValidation: false,
    } as CreateUserInput;

    const userId = await service.create(input);

    expect(userId).toBeTruthy();

    const user = await service.findByUsernameOrEmail(input.email);

    expect(user).toBeTruthy();

    expect(user.email).toBe(input.email);
    expect(user.username).toBe(input.username);
    expect(user.firstName).toBe(input.firstName);
    expect(user.lastName).toBe(input.lastName);

    expect(user.password).toMatchObject({
      requiresEmailValidation: false,
      isEnabled: true,
    } as Partial<UserPassword>);

    expect(
      service.security.isPasswordCorrect(user.password.hash, input.password),
    ).toBe(true);
  });

  test('create() - requires e-mail validation', async () => {
    const input = {
      email: 'test@gmail.com',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
      username: 'username',

      requiresEmailValidation: true,
    } as CreateUserInput;

    await service.create(input);

    const user = await service.findByUsernameOrEmail(input.email);

    expect(user.password).toMatchObject({
      requiresEmailValidation: true,
      isEnabled: false,
    } as Partial<UserPassword>);
  });

  test('create() - throws UserAlreadyExistsException', async () => {
    const initialEmail = 'test@gmail.com';

    const input = {
      email: initialEmail,
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
      username: 'username',

      requiresEmailValidation: true,
    } as CreateUserInput;

    await service.create(input);

    // Both e-mail and username are the same
    await expect(service.create(input)).rejects.toThrow(
      new UserAlreadyExistsException(),
    );

    input.email = 'different@gmail.com';

    // Username is the same
    await expect(service.create(input)).rejects.toThrow(
      new UserAlreadyExistsException(),
    );

    input.email = initialEmail;
    input.username = 'different-username';

    // E-mail is the same
    await expect(service.create(input)).rejects.toThrow(
      new UserAlreadyExistsException(),
    );
  });

  test('findByEmailOrUsername()', async () => {
    const input = {
      email: 'test@gmail.com',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
      username: 'username',

      requiresEmailValidation: true,
    } as CreateUserInput;

    const userId = await service.create(input);

    let foundUser = await service.findByUsernameOrEmail(input.username);

    expect(foundUser._id).toStrictEqual(userId);

    foundUser = await service.findByUsernameOrEmail(input.email);

    expect(foundUser._id).toStrictEqual(userId);

    foundUser = await service.findByUsernameOrEmail('not-existing');

    expect(foundUser).toBeNull();
  });
});
