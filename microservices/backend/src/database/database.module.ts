import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { ConfigModule } from '@root/config/config.module';
import { ConfigKey } from '@root/config/configuration';

import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get(ConfigKey.MONGO_URI),
        } as MongooseModuleFactoryOptions;
      },

      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
