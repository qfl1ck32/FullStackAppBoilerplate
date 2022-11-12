import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ConfigKey } from '@root/config/configuration';
import { UserNotAuthorizedException } from '@root/roles/exceptions/UserNotAuthorized.exception';

import { ExpiredJwtException } from './exceptions/ExpiredJwt.exception';
import { InvalidJwtException } from './exceptions/InvalidJwt.exception';

import { JWTAccessTokenAuthPayload } from './auth.defs';
import { AuthService } from './auth.service';

import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

export type RequestJwtType = {
  payload: JWTAccessTokenAuthPayload;
  error: any;
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, _: any, next: () => void) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      req.jwt = {
        payload: null,
        error: new UserNotAuthorizedException(),
      };

      return next();
    }

    const accessToken = authorizationHeader.split(' ')[1]; // Bearer ...

    const secret = this.configService.get(ConfigKey.JWT_SECRET);

    try {
      const payload =
        await this.jwtService.verifyAsync<JWTAccessTokenAuthPayload>(
          accessToken,
          {
            secret,
          },
        );

      req.jwt = {
        payload,
        error: null,
      };
    } catch (err) {
      const error =
        err instanceof TokenExpiredError
          ? new ExpiredJwtException()
          : new InvalidJwtException();

      req.jwt = {
        payload: null,
        error,
      };
    }

    return next();
  }
}
