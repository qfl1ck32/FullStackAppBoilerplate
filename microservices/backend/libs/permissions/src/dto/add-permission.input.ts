import { ObjectId } from '@app/collections/defs';

export class AddPermissionInput {
  permission: string;
  domain: string;
  userId: ObjectId;
}
