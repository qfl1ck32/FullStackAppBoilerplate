import { Field } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Blameable } from '@app/collections/behaviours/blameable.behaviour';
import { Softdeletable } from '@app/collections/behaviours/softdeletable.behaviour';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { Entity, Mix } from '@app/collections/collections.class';
import { ObjectId } from '@app/collections/defs';

@Schema()
export class Permission extends Mix(
  Entity,
  Timestampable,
  Softdeletable,
  Blameable,
) {
  @Prop()
  permission: string;

  @Prop()
  domain: string;

  @Prop()
  userId: ObjectId;
}
