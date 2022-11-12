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

export type Decorator = (
  target: Object,
  key: string | symbol,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor | void;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
