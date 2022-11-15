import { ObjectId } from '@app/collections/defs';

import { RequestJwtType } from './auth.middleware';

import 'express';

declare module 'express' {
  interface Request {
    jwt: RequestJwtType | undefined;
  }
}

declare module '@app/config/defs' {
  export interface Config {
    JWT_SECRET: string;
  }
}

export enum JWTTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface JWTAccessTokenAuthPayload {
  userId: ObjectId;
  type: JWTTokenType;
}

export interface JWTRefreshTokenAuthPayload {
  userId: ObjectId;
  type: JWTTokenType;
}
