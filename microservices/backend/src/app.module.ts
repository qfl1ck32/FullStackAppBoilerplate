import { Module } from '@nestjs/common';

import { GraphQLModule } from '@app/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [GraphQLModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
