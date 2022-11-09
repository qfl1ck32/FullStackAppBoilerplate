import { RequestJwtType } from './auth/auth.middleware';
import 'express';
import 'mongoose';

declare module 'express' {
  interface Request {
    jwt: RequestJwtType | undefined;
  }
}

export type Constructor<Return = any, Args = any> = new (
  ...args: Args[]
) => Return;

// TODO: Magic :)
declare module 'mongoose' {
  class Collection {
    constructor(name: string, conn: Connection, opts?: any);
  }
}
