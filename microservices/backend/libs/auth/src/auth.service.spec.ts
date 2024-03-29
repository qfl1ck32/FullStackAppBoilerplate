import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@app/config';
import { PermissionsService } from '@app/permissions';
import { Domain, Role } from '@app/permissions/defs';
import { Permission } from '@app/permissions/permissions';

import { LoginUserInput } from './dto/login.input';
import { RegisterUserInput } from './dto/register.input';

import { ExpiredJwtException } from './exceptions/ExpiredJwt.exception';
import { InvalidJwtException } from './exceptions/InvalidJwt.exception';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { WrongPasswordException } from './exceptions/WrongPassword.exception';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import {
  JWTAccessTokenAuthPayload,
  JWTRefreshTokenAuthPayload,
  JWTTokenType,
} from './defs';

// TODO: remove this input, lol
import { registerUserTestInput } from '@test/utils/inputs';

describe('AuthService', () => {
  let service: AuthService;
  let permissionsService: PermissionsService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    permissionsService = module.get(PermissionsService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('register()', async () => {
    const userId = await service.register(registerUserTestInput);

    const permissions = await permissionsService.find({ userId });

    expect(permissions).toHaveLength(1);

    expect(permissions[0]).toMatchObject({
      domain: Domain.app,
      permission: Role.end_user,
      userId,
    } as Partial<Permission>);
  });

  test('login()', async () => {
    const registerInput = {
      firstName: 'firstName',
      lastName: 'lastName',
      username: 'username',
      email: 'test@gmail.com',
      password: 'password',
    } as RegisterUserInput;

    const userId = await service.register(registerInput);

    const input = {
      usernameOrEmail: registerInput.username + '.',
      password: registerInput.password + '.',
    } as LoginUserInput;

    await expect(service.login(input)).rejects.toThrow(
      new UserNotFoundException(),
    );

    input.usernameOrEmail = registerInput.username;

    await expect(service.login(input)).rejects.toThrow(
      new WrongPasswordException(),
    );

    input.password = registerInput.password;

    const { accessToken, refreshToken } = await service.login(input);

    expect(accessToken).toBeTruthy();

    expect(refreshToken).toBeTruthy();

    const secret = configService.get('JWT_SECRET');

    const accessTokenPayload = jwtService.verify<JWTAccessTokenAuthPayload>(
      accessToken,
      {
        secret,
      },
    );

    expect(accessTokenPayload).toMatchObject({
      userId,
    });

    const refreshTokenPayload = jwtService.verify<JWTRefreshTokenAuthPayload>(
      refreshToken,
      {
        secret,
      },
    );

    expect(refreshTokenPayload).toMatchObject({
      userId,
    });

    // TODO: test "expiresIn"
  });

  test('issueAccessToken()', async () => {
    const userId = await service.register(registerUserTestInput);

    const { accessToken, refreshToken } = await service.login({
      usernameOrEmail: registerUserTestInput.email,
      password: registerUserTestInput.password,
    });

    await expect(
      service.issueAccessToken({ refreshToken: 'dummy' }),
    ).rejects.toThrow(new InvalidJwtException());

    await expect(
      service.issueAccessToken({ refreshToken: accessToken }),
    ).rejects.toThrow(new InvalidJwtException());

    const secret = configService.get('JWT_SECRET');

    const expiredToken = jwtService.sign({}, { secret, expiresIn: '1 second' });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await expect(
      service.issueAccessToken({ refreshToken: expiredToken }),
    ).rejects.toThrow(new ExpiredJwtException());

    const issuedAccessToken = await service.issueAccessToken({ refreshToken });

    expect(issuedAccessToken).toBeTruthy();
  });

  test('generateAccessToken()', async () => {
    const userId = await service.register(registerUserTestInput);

    const accessToken = await service.generateAccessToken(userId);

    const secret = configService.get('JWT_SECRET');

    const payload = jwtService.verify<JWTAccessTokenAuthPayload>(accessToken, {
      secret,
    });

    expect(payload).toMatchObject({
      userId,
      type: JWTTokenType.ACCESS,
    });
  });

  test('generateRefreshToken()', async () => {
    const userId = await service.register(registerUserTestInput);

    const refreshToken = await service.generateRefreshToken(userId);

    const secret = configService.get('JWT_SECRET');

    const payload = jwtService.verify<JWTRefreshTokenAuthPayload>(
      refreshToken,
      {
        secret,
      },
    );

    expect(payload).toMatchObject({
      userId,
      type: JWTTokenType.REFRESH,
    });
  });
});
