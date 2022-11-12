import { ObjectId } from '@app/collections/defs';

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
