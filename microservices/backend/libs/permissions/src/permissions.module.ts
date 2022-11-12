import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';

import { PermissionsCollection } from './entities/permission.entity';

import { PermissionsService } from './permissions.service';

@Module({
  imports: [DatabaseModule],

  providers: [PermissionsService, PermissionsCollection],
  exports: [PermissionsService, PermissionsCollection],
})
export class PermissionsModule {}
