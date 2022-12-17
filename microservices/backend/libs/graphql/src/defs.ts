import { ID as BaseID } from '@nestjs/graphql';

import { ObjectId } from '@app/collections/defs';

import { Request } from 'express';

export const ROLES_KEY = 'ROLES';

export type GQLContext = {
  req: Request;
  userId?: ObjectId;
};

export const Id = BaseID;
