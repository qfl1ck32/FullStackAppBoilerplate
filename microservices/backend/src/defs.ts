import '@app/config/defs';
import '@app/permissions/defs';

import 'mongoose';

declare module '@app/config/defs' {
  export interface Config {
    APP_PORT: number;
  }
}
