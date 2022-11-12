import { ObjectId } from '@app/collections/defs';

export class HasPermissionInput {
  permission: string | string[];

  domain: string;
  userId: ObjectId;
}
