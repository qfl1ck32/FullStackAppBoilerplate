import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { AddBehaviour } from './utils';

import { BehaviourFunction, TimestampableBehaviourOptions } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';

import { decorate } from 'ts-mixer';

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

export const timestampable: BehaviourFunction<
  Timestampable,
  TimestampableBehaviourOptions
> = (options) => {
  return (collection) => {
    const listener = async (event: BeforeInsertEvent<Timestampable>) => {
      const { payload } = event;

      const { document } = payload;

      const date = new Date();

      document.createdAt = date;
      document.updatedAt = date;
    };

    return collection.localEventManager.addListener(
      BeforeInsertEvent,
      listener,
    );
  };
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
