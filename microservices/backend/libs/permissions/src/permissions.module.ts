import { DynamicModule, Global, Module } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { ProvideCollection } from '@app/collections/collections.provider';

import { Role } from './defs';
import { PermissionEntity } from './permission';
import { PermissionsService } from './permissions.service';

@Global()
@Module({})
export class PermissionsModule {
  static forRoot(): DynamicModule {
    registerEnumType(Role, {
      // TODO: get from the enum? Reflect.
      name: 'Role',
    });

    return {
      module: PermissionsModule,

      providers: [PermissionsService, ProvideCollection(PermissionEntity)],
      exports: [PermissionsService],
    };
  }
}
