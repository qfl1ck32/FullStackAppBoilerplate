import { DynamicModule, Global, Module } from '@nestjs/common';

import { ProvideCollection } from '@app/collections/collections.provider';
import { replaceEnumAtRuntime } from '@app/core/core.utils';
import { registerEnumType } from '@app/graphql/defs';

import { PermissionsModuleForRootArgs, Role } from './defs';
import { PermissionEntity } from './permissions';
import { PermissionsService } from './permissions.service';

@Global()
@Module({})
export class PermissionsModule {
  static forRoot(args: PermissionsModuleForRootArgs = {}): DynamicModule {
    const NewRole = args.roleRef;

    if (NewRole) {
      replaceEnumAtRuntime(Role, NewRole);
    }

    registerEnumType({ Role });

    return {
      module: PermissionsModule,

      providers: [PermissionsService, ProvideCollection(PermissionEntity)],
      exports: [PermissionsService],
    };
  }
}
