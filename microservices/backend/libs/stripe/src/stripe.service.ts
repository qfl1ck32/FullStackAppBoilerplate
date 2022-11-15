import { Injectable } from '@nestjs/common';

import { ConfigService } from '@app/config';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(protected readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_API_KEY'), {
      apiVersion: '2022-08-01',
    });
  }
}
