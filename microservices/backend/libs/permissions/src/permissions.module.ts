import { DynamicModule, Global, Module } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { ProvideCollection } from '@app/collections/collections.provider';

import { PermissionEntity } from './entities/permission.entity';

import { Role } from './defs';
import { PermissionsService } from './permissions.service';

@Global()
@Module({})
export class PermissionsModule {
  static forRoot(): DynamicModule {
    registerEnumType(Role, {
      name: 'Role',
    });

    return {
      module: PermissionsModule,

      providers: [PermissionsService, ProvideCollection(PermissionEntity)],
      exports: [PermissionsService],
    };
  }
}
