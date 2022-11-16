import { OnEvent as BaseOnEvent } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';

import { Constructor } from '@app/core/defs';

import { Event } from '../event.class';

export const OnEvent = (
  event: Constructor<Event>,
  options?: OnEventOptions,
) => {
  return BaseOnEvent(event.name, options);
};
