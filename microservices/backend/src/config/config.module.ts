import { Module } from '@nestjs/common';
import {
  ConfigModule as BaseConfigModule,
  ConfigService,
} from '@nestjs/config';

import configuration from './configuration';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [configuration],

      envFilePath: env === 'development' ? '.env' : `.env.${env}`,
    }),
  ],

  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
