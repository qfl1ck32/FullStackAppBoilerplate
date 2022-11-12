import { Prop, Schema } from '@nestjs/mongoose';

import {
  Entity,
  Mix,
  createCollection,
} from '@app/collections/collections.class';
import { ObjectId } from '@app/collections/defs';

@Schema()
export class Permission extends Mix(Entity) {
  @Prop()
  permission: string;

  @Prop()
  domain: string;

  @Prop()
  userId: ObjectId;
}

export class PermissionsCollection extends createCollection(Permission) {}
