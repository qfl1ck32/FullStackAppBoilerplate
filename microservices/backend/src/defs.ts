import '@app/config/defs';
import '@app/permissions/defs';

import 'mongoose';

declare module '@app/config/defs' {
  export interface Config {
    APP_PORT: number;
  }
}

export enum Language {
  ro = 'ro',
  en = 'en',
}

export enum Role {
  admin = 'admin',
  end_user = 'end_user',
}
