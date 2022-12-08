import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ObjectId } from '@app/collections/defs';
import { ConfigService } from '@app/config';
import { PermissionsService } from '@app/permissions';
import { Domain, Role } from '@app/permissions/defs';
import { UsersService } from '@app/users';
import { UsersSecurityService } from '@app/users/users-security.service';

import { IssueAccessTokenInput } from './dto/issueAccessToken.input';
import { LoginUserInput, LoginUserResponse } from './dto/login.input';
import { RegisterUserInput } from './dto/register.input';

import { ExpiredJwtException } from './exceptions/ExpiredJwt.exception';
import { InvalidJwtException } from './exceptions/InvalidJwt.exception';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { WrongPasswordException } from './exceptions/WrongPassword.exception';

import {
  JWTAccessTokenAuthPayload,
  JWTRefreshTokenAuthPayload,
  JWTTokenType,
} from './defs';

import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  public accessTokenExpiry: string;
  public refreshTokenExpiry: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly usersSecurityService: UsersSecurityService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly permissionService: PermissionsService,
  ) {
    this.accessTokenExpiry = '30 minutes';
    this.refreshTokenExpiry = '2 hours';
  }

  async register(input: RegisterUserInput) {
    const userId = await this.usersService.create({
      ...input,

      requiresEmailValidation: true,
    });

    await this.permissionService.add({
      permission: Role.end_user,
      domain: Domain.app,
      userId,
    });

    // TODO: more logic

    return userId;
  }

  async login(input: LoginUserInput): Promise<LoginUserResponse> {
    const { usernameOrEmail, password } = input;

    const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordOK = this.usersSecurityService.isPasswordCorrect(
      user.password.hash,
      password,
    );

    if (!isPasswordOK) {
      throw new WrongPasswordException();
    }

    const { _id: userId } = user;

    const accessToken = await this.generateAccessToken(userId);

    const refreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  public async issueAccessToken(input: IssueAccessTokenInput) {
    const { refreshToken } = input;

    const secret = this.configService.get('JWT_SECRET');

    try {
      const payload = this.jwtService.verify<JWTRefreshTokenAuthPayload>(
        refreshToken,
        {
          secret,
        },
      );

      const { userId, type } = payload;

      if (type !== JWTTokenType.REFRESH) {
        throw new InvalidJwtException();
      }

      return this.generateAccessToken(userId);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredJwtException();
      }

      throw new InvalidJwtException();
    }
  }

  public async generateAccessToken(userId: ObjectId) {
    const payload = {
      userId,
      type: JWTTokenType.ACCESS,
    } as JWTAccessTokenAuthPayload;

    const secret = this.configService.get('JWT_SECRET');

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: this.accessTokenExpiry,
    });
  }

  public async generateRefreshToken(userId: ObjectId) {
    const payload = {
      userId,
      type: JWTTokenType.REFRESH,
    } as JWTRefreshTokenAuthPayload;

    const secret = this.configService.get('JWT_SECRET');

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: this.refreshTokenExpiry,
    });
  }
}
