import { Module } from '@nestjs/common';

import { CollectionsModule } from '@app/collections';
import { ProvideCollection } from '@app/collections/collections.provider';
import { DatabaseModule } from '@app/database';

import { PermissionEntity } from './entities/permission.entity';

import { PermissionsService } from './permissions.service';

@Module({
  imports: [DatabaseModule, CollectionsModule],

  providers: [PermissionsService, ProvideCollection(PermissionEntity)],
  exports: [PermissionsService],
})
export class PermissionsModule {}
