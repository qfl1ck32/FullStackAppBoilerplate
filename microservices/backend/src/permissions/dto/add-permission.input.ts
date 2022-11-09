import { ObjectId } from '@root/database/defs';

export class AddPermissionInput {
  permission: string;
  domain: string;
  userId: ObjectId;
}
