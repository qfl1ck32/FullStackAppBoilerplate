import { ObjectId } from '@root/database/database.types';

export class AddPermissionInput {
  permission: string;
  domain: string;
  userId: ObjectId;
}
