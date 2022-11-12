import { Injectable } from '@nestjs/common';

import { Collection } from '@app/collections/collections.class';
import { InjectCollection } from '@app/collections/collections.decorators';

import { AddPermissionInput } from './dto/add-permission.input';
import { FindPermissionInput } from './dto/find-permission.input';
import { HasPermissionInput } from './dto/has-permission.input';
import { RemovePermissionInput } from './dto/remove-permission.input';

import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectCollection(Permission)
    public collection: Collection<Permission>,
  ) {}

  async find(input: FindPermissionInput) {
    return this.collection.find(input);
  }

  async has(input: HasPermissionInput) {
    const { permission, userId, domain } = input;

    const permissions = Array.isArray(permission) ? permission : [permission];

    return this.collection.exists({
      userId,
      domain,

      $or: permissions.map((permission) => ({
        permission,
      })),
    });
  }

  async add(input: AddPermissionInput) {
    const { userId, permission, domain } = input;

    const existingPermission = await this.collection.exists({
      userId,
      domain,
      permission,
    });

    if (existingPermission) {
      return;
    }

    const { insertedId: permissionId } = await this.collection.insertOne({
      userId,
      permission,
      domain,
    });

    return permissionId;
  }

  async remove(input: RemovePermissionInput) {
    const result = await this.collection.findOneAndDelete(input);

    return result?.value?._id;
  }
}
