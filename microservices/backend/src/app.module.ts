import { Module } from '@nestjs/common';

import { GraphQLModule } from '@app/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { StripeModule } from 'libs/stripe/src';

@Module({
  imports: [GraphQLModule, StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
