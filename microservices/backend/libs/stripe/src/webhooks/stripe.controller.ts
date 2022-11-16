import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';

import { EventManagerService } from '@app/event-manager';
import { OnEvent } from '@app/event-manager/decorators/on-event.decorator';

import { StripeEvent } from '../events/stripe.event';
import { StripeService } from '../stripe.service';

import { Request, Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly eventManager: EventManagerService,
  ) {}
  @Post('/webhooks')
  async onWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Res() response: Response,
  ) {
    const { event, error } = this.stripeService.constructEvent(request);

    if (error) {
      return response.status(400).send(`Error: ${error.toString()}`);
    }

    await this.eventManager.emit(new StripeEvent(event));

    response.json({
      success: true,
    });
  }

  @OnEvent(StripeEvent)
  public async x(event: StripeEvent) {
    const { payload } = event;

    if (payload.type === 'customer.created') {
      console.log(payload.data.object);
    }
  }
}
