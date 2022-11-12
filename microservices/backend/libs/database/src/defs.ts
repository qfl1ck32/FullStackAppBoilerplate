import '@app/config/defs';

declare module '@app/config/defs' {
  interface Config {
    MONGO_URI: string;
  }
}
