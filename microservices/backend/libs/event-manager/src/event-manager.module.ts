import { Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { EventManagerService } from './event-manager.service';

@Module({
  imports: [EventEmitterModule.forRoot()],

  // If I provide here "EventEmitter2", it stops working. Interesting?
  providers: [EventManagerService],
  exports: [EventManagerService],
})
export class EventManagerModule {}
