import { Field } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Blameable } from '@app/collections/behaviours/blameable.behaviour';
import { Softdeletable } from '@app/collections/behaviours/softdeletable.behaviour';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { Entity, Mix } from '@app/collections/collections.class';
import { ObjectId, createEntity } from '@app/collections/defs';

export class DBPermission {
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
  Entity,
  Timestampable,
  Softdeletable,
  Blameable,
) {}

export const PermissionEntity = createEntity(DBPermission, Permission);
