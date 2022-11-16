import { Event } from '@app/event-manager/event.class';

import Stripe from 'stripe';

export class StripeEvent extends Event<Stripe.DiscriminatedEvent> {}
