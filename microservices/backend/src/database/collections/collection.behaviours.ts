import { SetMetadata } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Constructor } from '@root/defs';

/*
    MAGIC: I have NO clue what's going on here. If I only use "UserClass" instead of "User", it fails saying that
    Error: Cannot determine a type for the "Blameable.createdByUser" field (union/intersection/ambiguous type was used). Make sure your property is decorated with a "@Prop({ type: TYPE_HERE })" decorator.
    I expect that there are circular imports, but why using UserClass AND UserType solves it? Still circular imports, right?

    Update, 1 day later: yes, still circular imports, but the idea is that @Field(() => UserClass) was fine, because it's a function that will be called
    after the User file will be loaded (how do they ensure this, though?), but for @Prop(), it was trying to get some metadata from "UserClass"
    which was undefined at that time. Using "import type { ... }", I am importing the type of the class (how does this work?) and Reflect
    can now get metadata from it? How, tho?

    If I import UsersCollection, not even "import type { ... }" saves this anymore.
    Now it's broken for no reason. Ok...
    Ok, it was working, I just removed "type" from UserType, WTF?
*/
import type { User as UserType } from '@root/users/entities/user.entity';
import { User } from '@root/users/entities/user.entity';

import { BehaviourFunction } from './collection.types';

import { Relations } from '../database.decorators';
import { ObjectId } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { UserMissingException } from '../exceptions/user-missing.exception';

import { decorate } from 'ts-mixer';

const timestampable: BehaviourFunction = (collection) => {
  const listener = async (event: BeforeInsertEvent) => {
    const { payload } = event;

    const { document } = payload;

    const date = new Date();

    document['createdAt'] = date;
    document['updatedAt'] = date;
  };

  return collection.eventManager.addListener(BeforeInsertEvent, listener);
};

const blameable: BehaviourFunction = (collection) => {
  const listener = async (event: BeforeInsertEvent) => {
    const { payload } = event;

    const { document, context } = payload;

    if (!context?.userId) {
      throw new UserMissingException();
    }

    const { userId } = context;

    document['createdByUserId'] = userId;
  };

  return collection.eventManager.addListener(BeforeInsertEvent, listener);
};

const softdeletable: BehaviourFunction = (collection) => {
  collection.deleteOne = async (filter, options) => {
    const { acknowledged, modifiedCount } = await collection.updateOne(
      filter,
      {
        $set: {
          isDeleted: true,
        },
      },
      options,
    );

    return {
      acknowledged,
      deletedCount: modifiedCount,
    };
  };
};

const AddBehaviour = (behaviour: BehaviourFunction) => {
  return SetMetadata(`Behaviour.${behaviour.name}`, behaviour);
};

@decorate(ObjectType())
@decorate(Schema())
@decorate(AddBehaviour(timestampable))
export class Timestampable {
  @decorate(Field(() => Date))
  @decorate(Prop())
  createdAt: Date;

  @decorate(Field(() => Date))
  @decorate(Prop())
  updatedAt: Date;
}

@decorate(ObjectType())
@decorate(Schema())
@decorate(AddBehaviour(blameable))
@decorate(
  Relations<Blameable>()
    .add({
      field: 'createdByUser',
      fieldId: 'createdByUserId',
      to: () => User,
    })
    .build(),
)
export class Blameable {
  @decorate(Field(() => ID))
  @decorate(Prop())
  createdByUserId: ObjectId;

  @decorate(Field(() => User))
  @decorate(Prop())
  createdByUser: UserType;

  @decorate(Field(() => [User]))
  @decorate(Prop())
  createdByUsers: UserType[];
}

@decorate(ObjectType())
@decorate(Schema())
@decorate(AddBehaviour(softdeletable))
export class Softdeletable {
  @decorate(Field(() => Boolean, { nullable: true }))
  @decorate(Prop())
  isDeleted?: boolean;

  @decorate(Field(() => Date, { nullable: true }))
  @decorate(Prop())
  deletedAt?: Date;

  @decorate(Field(() => ID, { nullable: true }))
  @decorate(Prop())
  deletedByUserId?: ObjectId;

  @decorate(Field(() => User, { nullable: true }))
  @decorate(Prop())
  deletedByUser?: UserType;
}

export function getBehaviours<T>(model: Constructor<T>) {
  const keys = Reflect.getMetadataKeys(model) as string[];

  return keys
    .filter((key) => key.startsWith('Behaviour.'))
    .map((key) => Reflect.getMetadata(key, model));
}
