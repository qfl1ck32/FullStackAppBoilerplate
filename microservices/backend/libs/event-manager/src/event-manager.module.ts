import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { EventManagerService } from './event-manager.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],

  providers: [EventManagerService],
  exports: [EventManagerService],
})
export class EventManagerModule {}
