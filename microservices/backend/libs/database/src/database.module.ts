import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@app/config';
import { EventManagerModule, EventManagerService } from '@app/event-manager';

import { DatabaseService } from './database.service';

@Module({
  imports: [
    EventManagerModule,
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

  providers: [DatabaseService, EventManagerService],
  exports: [DatabaseService, EventManagerService],
})
export class DatabaseModule {}
