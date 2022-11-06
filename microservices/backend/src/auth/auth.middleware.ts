import { Env } from '@root/config/configuration';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { ExpiredJwtException } from './exceptions/ExpiredJwt.exception';
import { InvalidJwtException } from './exceptions/InvalidJwt.exception';
import {
  JWTAccessTokenAuthPayload,
  JWTRefreshTokenAuthPayload,
} from './types/jwt-payload.type';

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

  async use(req: any, res: any, next: () => void) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) return next();

    const accessToken = authorizationHeader.split(' ')[1]; // Bearer ...

    const secret = this.configService.get(Env.JWT_SECRET);

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
