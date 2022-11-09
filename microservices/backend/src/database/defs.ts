import { ObjectId } from 'bson';

export { ObjectId };

export interface Context {
  userId?: ObjectId;
}

export interface DBContext {
  context?: Context;
}
