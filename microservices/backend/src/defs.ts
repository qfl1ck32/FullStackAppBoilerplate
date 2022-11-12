import '@app/config/defs';

import 'mongoose';

declare module '@app/config/defs' {
  export interface Config {
    JWT_SECRET: string;
  }
}
