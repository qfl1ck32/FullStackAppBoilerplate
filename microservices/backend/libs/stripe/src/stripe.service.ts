import { Injectable, RawBodyRequest } from '@nestjs/common';

import { ConfigService } from '@app/config';

import { ConstructedEvent } from './defs';

import { STRIPE_SIGNATURE_KEY } from '../constants';

import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(protected readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_API_KEY'), {
      apiVersion: '2022-08-01',
    });
  }

  public constructEvent(req: RawBodyRequest<Request>): ConstructedEvent {
    try {
      return {
        event: this.stripe.webhooks.constructEvent(
          req.rawBody,
          req.headers[STRIPE_SIGNATURE_KEY],
          this.configService.get('STRIPE_WEBHOOKS_SECRET'),
        ) as Stripe.DiscriminatedEvent,
        error: null,
      };
    } catch (error) {
      return {
        event: null,
        error,
      };
    }
  }
}
