import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Constructor } from '@root/defs';

import { Event } from './event.class';

export type ListenerFn<T> = (payload: T) => void | Promise<void>;

@Injectable()
export class EventManagerService {
  private eventEmitter2: EventEmitter2;

  constructor() {
    this.eventEmitter2 = new EventEmitter2();
  }

  async emit<T>(event: Event<T>) {
    return this.eventEmitter2.emit(event.constructor.name, event);
  }

  async addListener<T>(
    event: Constructor<Event<T>>,
    listener: ListenerFn<Event<T>>,
  ) {
    return this.eventEmitter2.addListener(event.name, listener);
  }
}
