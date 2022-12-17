import { DynamicModule, Global, Module } from '@nestjs/common';

import { ProvideCollection } from '@app/collections/collections.provider';
import { registerEnumType } from '@app/graphql/defs';

import { Role } from './defs';
import { PermissionEntity } from './permissions.class';
import { PermissionsService } from './permissions.service';

@Global()
@Module({})
export class PermissionsModule {
  static forRoot(): DynamicModule {
    registerEnumType({ Role });

    return {
      module: PermissionsModule,

      providers: [PermissionsService, ProvideCollection(PermissionEntity)],
      exports: [PermissionsService],
    };
  }
}
