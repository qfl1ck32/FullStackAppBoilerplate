import { Prop, Schema } from '@nestjs/mongoose';

import { Entity } from '@app/collections/collections.class';
import { ObjectId } from '@app/collections/defs';

@Schema()
export class Permission extends Entity {
  @Prop()
  permission: string;

  @Prop()
  domain: string;

  @Prop()
  userId: ObjectId;
}
