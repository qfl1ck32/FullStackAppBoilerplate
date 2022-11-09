import { ObjectId } from '@root/database/defs';

import { Request } from 'express';

export type GQLContext = {
  req: Request;
  userId?: ObjectId;
};
