import { ObjectId } from '@app/collections/defs';

import { Request } from 'express';

export const ROLES_KEY = 'ROLES';

export type GQLContext = {
  req: Request;
  userId?: ObjectId;
};
