import { Blameable } from '@app/collections/behaviours/blameable.behaviour';
import { Softdeletable } from '@app/collections/behaviours/softdeletable.behaviour';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { Combine, Entity } from '@app/collections/collections';
import { Prop, Schema } from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';
import { createEntity } from '@app/collections/utils';

export class DBPermission extends Entity {
  @Prop()
  permission: string;

  @Prop()
  domain: string;

  @Prop()
  userId: ObjectId;
}

@Schema()
export class Permission extends Combine(
  DBPermission,
  Timestampable,
  Softdeletable,
  Blameable,
) {}

export const PermissionEntity = createEntity({
  database: DBPermission,
  relational: Permission,
});
