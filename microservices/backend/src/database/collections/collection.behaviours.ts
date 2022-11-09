import { SetMetadata } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Constructor } from '@root/defs';

import { ObjectId } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { UserMissingException } from '../exceptions/user-missing.exception';

import { Collection } from './collection.class';
import { Document } from 'mongoose';
import { Mixin, decorate } from 'ts-mixer';

export const WithBehaviours = Mixin;

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

const AddBehaviour = (behaviour: BehaviourFunction) => {
  return SetMetadata(`Behaviour.${behaviour.name}`, behaviour);
};

export type BehaviourFunction<T extends Document = any> = (
  collection: Collection<T>,
) => void;

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
export class Blameable {
  @decorate(Field(() => String))
  @decorate(Prop())
  createdByUserId: ObjectId;
}

export const getBehaviours = (Class: Constructor) => {
  const keys = Reflect.getMetadataKeys(Class) as string[];

  return keys
    .filter((key) => key.startsWith('Behaviour.'))
    .map((key) => Reflect.getMetadata(key, Class));
};
