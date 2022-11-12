import { RequestJwtType } from './auth.middleware';

import 'express';

declare module 'express' {
  interface Request {
    jwt: RequestJwtType | undefined;
  }
}
