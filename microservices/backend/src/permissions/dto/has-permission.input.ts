import { ObjectId } from '@root/database/defs';

export class HasPermissionInput {
  permission: string | string[];

  domain: string;
  userId: ObjectId;
}
