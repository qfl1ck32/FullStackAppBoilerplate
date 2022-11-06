import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { LoginUserInput, LoginUserResponse } from './dto/login.input';
import { ConfigService } from '@nestjs/config';

import { RegisterUserInput } from './dto/register.input';
import {
  JWTAccessTokenAuthPayload,
  JWTRefreshTokenAuthPayload,
  JWTTokenType,
} from './types/jwt-payload.type';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { WrongPasswordException } from './exceptions/WrongPassword.exception';
import { Domain, Role } from '@root/roles/roles.enum';
import { Env } from '@root/config/configuration';
import { PermissionsService } from '@root/permissions/permissions.service';
import { UsersService } from '@root/users/users.service';
import { UsersSecurityService } from '@root/users-security/users-security.service';
import { ObjectId } from '@root/database/database.types';
import { IssueAccessTokenInput } from './dto/issueAccessToken.input';
import { InvalidJwtException } from './exceptions/InvalidJwt.exception';
import { ExpiredJwtException } from './exceptions/ExpiredJwt.exception';

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
    this.accessTokenExpiry = '2 minutes';
    this.refreshTokenExpiry = '2 hours';
  }

  async register(input: RegisterUserInput) {
    const user = await this.usersService.create({
      ...input,

      requiresEmailValidation: true,
    });

    const { _id: userId } = user;

    await this.permissionService.add({
      permission: Role.END_USER,
      domain: Domain.APP,
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

    const secret = this.configService.get(Env.JWT_SECRET);

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

  private async generateAccessToken(userId: ObjectId) {
    const payload = {
      userId,
      type: JWTTokenType.ACCESS,
    } as JWTAccessTokenAuthPayload;

    const secret = this.configService.get(Env.JWT_SECRET);

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: this.accessTokenExpiry,
    });
  }

  private async generateRefreshToken(userId: ObjectId) {
    const payload = {
      userId,
      type: JWTTokenType.REFRESH,
    } as JWTRefreshTokenAuthPayload;

    const secret = this.configService.get(Env.JWT_SECRET);

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: this.refreshTokenExpiry,
    });
  }
}
