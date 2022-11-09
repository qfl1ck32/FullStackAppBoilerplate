export default () => ({
  JWT_SECRET: process.env.JWT_SECRET,
});

export enum ConfigKey {
  APP_NAME = 'APP_NAME',

  MONGO_URI = 'MONGO_URI',

  JWT_SECRET = 'JWT_SECRET',

  EMAIL_VERIFICATION_URL = 'EMAIL_VERIFICATION_URL',

  NODE_ENV = 'NODE_ENV',
}
