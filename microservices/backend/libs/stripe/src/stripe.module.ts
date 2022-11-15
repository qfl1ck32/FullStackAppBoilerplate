import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config';

import { StripeService } from './stripe.service';
import { StripeController } from './webhooks/stripe.controller';

@Module({
  imports: [ConfigModule],
  providers: [StripeService],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
