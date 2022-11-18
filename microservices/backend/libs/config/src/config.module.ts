import { Global, Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';

const env = process.env.NODE_ENV;

@Global()
@Module({
  imports: [
    BaseConfigModule.forRoot({
      envFilePath: env === 'development' ? '.env' : `.env.${env}`,
    }),
  ],

  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
