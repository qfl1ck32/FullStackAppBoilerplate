import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Constructor } from '@app/core/defs';

import { Event } from './event';

export type ListenerFn<T> = (payload: T) => void | Promise<void>;

@Injectable()
export class EventManagerService {
  constructor(public readonly eventEmitter: EventEmitter2) {}

  async emit<T>(event: Event<T>) {
    return this.eventEmitter.emitAsync(event.constructor.name, event);
  }

  async addListener<T>(
    event: Constructor<Event<T>>,
    listener: ListenerFn<Event<T>>,
  ) {
    return this.eventEmitter.addListener(event.name, listener);
  }
}

@Injectable({ scope: Scope.TRANSIENT })
export class LocalEventManagerService extends EventManagerService {}
