import { ObjectId } from '@app/collections/defs';

export class FindPermissionInput {
  userId?: ObjectId;
  permission?: string;
  domain?: string;
}
