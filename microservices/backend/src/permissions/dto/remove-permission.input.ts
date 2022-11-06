import { ObjectId } from '@root/database/database.types';

export class RemovePermissionInput {
  permission: string;
  domain: string;
  userId: ObjectId;
}
