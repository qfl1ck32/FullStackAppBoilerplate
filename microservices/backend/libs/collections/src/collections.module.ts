import { Module } from '@nestjs/common';

import { CollectionsStorage } from './collections.storage';

@Module({
  providers: [CollectionsStorage],
  exports: [CollectionsStorage],
})
export class CollectionsModule {}
