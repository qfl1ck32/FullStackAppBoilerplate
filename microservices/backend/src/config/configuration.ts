export default () => ({
  JWT_SECRET: process.env.JWT_SECRET,
});

export enum Env {
  APP_NAME = 'APP_NAME',

  MONGO_URI = 'MONGO_URI',

  JWT_SECRET = 'JWT_SECRET',

  NODE_ENV = 'NODE_ENV',
}
