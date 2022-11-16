import { Injectable, NestMiddleware } from '@nestjs/common';

import * as express from 'express';

@Injectable()
export class AddRawBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    express.raw({ type: 'application/json' })(req, res, next);
  }
}
