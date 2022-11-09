import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ObjectId } from '@root/database/defs';

import mongoose, { Document } from 'mongoose';

export type PermissionDocument = Permission & Document<ObjectId>;

@Schema()
export class Permission {
  @Prop()
  permission: string;

  @Prop()
  domain: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
