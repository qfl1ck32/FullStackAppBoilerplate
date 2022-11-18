import { Global, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@app/config';

import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get('MONGO_URI'),
        } as MongooseModuleFactoryOptions;
      },

      imports: [ConfigModule],

      inject: [ConfigService],
    }),
  ],

  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
