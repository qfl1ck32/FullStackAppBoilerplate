import { ObjectId } from '@root/database/database.types';

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
