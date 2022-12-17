import { Blameable } from '@app/collections/behaviours/blameable.behaviour';
import { Softdeletable } from '@app/collections/behaviours/softdeletable.behaviour';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { Entity, Mix } from '@app/collections/collections.class';
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
export class Permission extends Mix(
  DBPermission,
  Timestampable,
  Softdeletable,
  Blameable,
) {}

export const PermissionEntity = createEntity({
  database: DBPermission,
  relational: Permission,
});
