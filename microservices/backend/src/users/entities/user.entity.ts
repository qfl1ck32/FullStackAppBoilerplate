import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from '@root/database/database.types';
import { Role } from '@root/roles/roles.enum';
import { Document } from 'mongoose';

export type UserDocument = User & Document<ObjectId>;

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  hasEmailVerified: boolean;
}

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  @Prop()
  firstName: string;

  @Field(() => String)
  @Prop()
  lastName: string;

  @Field(() => String)
  @Prop()
  username: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => [Role])
  @Prop()
  roles: Role[];

  @Prop()
  password: UserPassword;
}

export const UserSchema = SchemaFactory.createForClass(User);

registerEnumType(Role, { name: 'Role' });
