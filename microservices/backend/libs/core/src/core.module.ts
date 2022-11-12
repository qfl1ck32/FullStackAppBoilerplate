import { Module } from '@nestjs/common';

import { CoreService } from './core.service';
import { RouterService } from './router/router.service';

@Module({
  providers: [CoreService, RouterService],
  exports: [CoreService, RouterService],
})
export class CoreModule {}
