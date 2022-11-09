import { ObjectId } from '@root/database/defs';

export class FindPermissionInput {
  userId?: ObjectId;
  permission?: string;
  domain?: string;
}
