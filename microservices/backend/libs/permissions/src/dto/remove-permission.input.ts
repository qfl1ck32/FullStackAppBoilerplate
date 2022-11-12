import { ObjectId } from '@app/collections/defs';

export class RemovePermissionInput {
  permission: string;
  domain: string;
  userId: ObjectId;
}
