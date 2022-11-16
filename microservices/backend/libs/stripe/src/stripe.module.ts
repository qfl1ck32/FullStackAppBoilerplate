import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ConfigModule } from '@app/config';
import { EventManagerModule } from '@app/event-manager';

import { AddRawBodyMiddleware } from './add-raw-body/add-raw-body.middleware';
import { StripeService } from './stripe.service';
import { StripeController } from './webhooks/stripe.controller';

@Module({
  imports: [ConfigModule, EventManagerModule],

  providers: [StripeService],

  exports: [StripeService],

  controllers: [StripeController],
})
export class StripeModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddRawBodyMiddleware).forRoutes({
      path: '/stripe/webhooks',
      method: RequestMethod.POST,
    });
  }
}
