import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EventManagerService } from './event-manager.service';

@Module({
  imports: [EventEmitterModule.forRoot()],

  providers: [EventManagerService],
})
export class EventManagerModule {}
