import { Module } from '@nestjs/common';

import { AuthModule } from '@app/auth';
import { GraphQLModule } from '@app/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { StripeModule } from 'libs/stripe/src';

@Module({
  imports: [GraphQLModule, StripeModule, AuthModule, GraphQLModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
