import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Permission, PermissionSchema } from './entities/permission.entity';

import { PermissionsService } from './permissions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],

  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
