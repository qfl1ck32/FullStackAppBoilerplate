import { ObjectId } from '@root/database/database.types';

export class HasPermissionInput {
  permission: string | string[];

  domain: string;
  userId: ObjectId;
}
