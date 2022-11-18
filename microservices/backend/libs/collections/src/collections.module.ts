import { Global, Module } from '@nestjs/common';

import { CollectionsStorage } from './collections.storage';

@Global()
@Module({
  providers: [CollectionsStorage],
  exports: [CollectionsStorage],
})
export class CollectionsModule {}
