import '@app/config/defs';

declare module '@app/config/defs' {
  interface Config {
    STRIPE_API_KEY: string;
  }
}
