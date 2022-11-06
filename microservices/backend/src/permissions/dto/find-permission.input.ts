import { ObjectId } from '@root/database/database.types';

export class FindPermissionInput {
  userId?: ObjectId;
  permission?: string;
  domain?: string;
}
