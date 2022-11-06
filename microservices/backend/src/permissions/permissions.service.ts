import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddPermissionInput } from './dto/add-permission.input';
import { FindPermissionInput } from './dto/find-permission.input';
import { HasPermissionInput } from './dto/has-permission.input';
import { RemovePermissionInput } from './dto/remove-permission.input';
import { Permission, PermissionDocument } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    public permissionModel: Model<PermissionDocument>,
  ) {}

  async find(input: FindPermissionInput) {
    return this.permissionModel.find(input);
  }

  async has(input: HasPermissionInput) {
    const { permission, userId, domain } = input;

    const permissions = Array.isArray(permission) ? permission : [permission];

    const exists = await this.permissionModel.exists({
      userId,
      domain,

      $or: permissions.map((permission) => ({
        permission,
      })),
    });

    return Boolean(exists);
  }

  async add(input: AddPermissionInput) {
    const { userId, permission, domain } = input;

    const existingPermission = await this.permissionModel.exists({
      userId,
      domain,
      permission,
    });

    if (existingPermission) {
      return;
    }

    const { _id: permissionId } = await new this.permissionModel({
      userId,
      permission,
      domain,
    }).save();

    return permissionId;
  }

  async remove(input: RemovePermissionInput) {
    const permission = await this.permissionModel.findOneAndDelete(input);

    return permission?._id;
  }
}
