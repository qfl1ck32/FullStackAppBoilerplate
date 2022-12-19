import { Global, Module } from '@nestjs/common';

import { ExceptionsService } from './exceptions.service';

@Global()
@Module({
  providers: [ExceptionsService],
  exports: [ExceptionsService],
})
export class ExceptionsModule {}
