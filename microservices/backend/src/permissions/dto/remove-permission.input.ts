import { ObjectId } from '@root/database/defs';

export class RemovePermissionInput {
  permission: string;
  domain: string;
  userId: ObjectId;
}
