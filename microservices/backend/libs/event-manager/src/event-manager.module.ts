import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import {
  EventManagerService,
  LocalEventManagerService,
} from './event-manager.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],

  providers: [EventManagerService, LocalEventManagerService],
  exports: [EventManagerService, LocalEventManagerService],
})
export class EventManagerModule {}
