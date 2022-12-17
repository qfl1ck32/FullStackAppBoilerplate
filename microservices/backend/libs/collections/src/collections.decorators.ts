import { Inject, applyDecorators } from '@nestjs/common';
import {
  Field as BaseField,
  FieldOptions,
  ObjectType,
  ObjectTypeOptions,
  ReturnTypeFunc,
} from '@nestjs/graphql';
import {
  Prop as BaseProp,
  PropOptions,
  Schema,
  SchemaOptions,
} from '@nestjs/mongoose';

import { Constructor, Decorator } from '@app/core/defs';

import { RelationArgs } from './defs';
import { getCollectionToken } from './utils';

import { decorate } from 'ts-mixer';

export function InjectCollection<T>(entity: Constructor<T>) {
  return Inject(getCollectionToken(entity));
}

const RELATIONS_METADATA_KEY = 'COLLECTION.RELATIONS';

function AddRelation<From, To>(relation: RelationArgs<From, To>) {
  // TODO: this can be optimised a bit - declare the array once, in "Relations()"
  const decoratorFactory: Decorator = (target) => {
    console.log({ target, relation: 1 });
    const relations = Reflect.getMetadata(RELATIONS_METADATA_KEY, target);

    relations.push(relation);

    Reflect.defineMetadata(RELATIONS_METADATA_KEY, relations, target);

    return target;
  };

  return decoratorFactory;
}

export function Relations<From>() {
  const defineRelationsField: Decorator = (target) => {
    Reflect.defineMetadata(RELATIONS_METADATA_KEY, [], target);
  };

  const decorators = [defineRelationsField] as Decorator[];

  const build = () => applyDecorators(...decorators);

  function add<To>(relation: RelationArgs<From, To>) {
    decorators.push(AddRelation(relation));

    return {
      add,
      build,
    };
  }

  return {
    add,
    build,
  };
}

export function getRelations<T>(entity: Constructor<T>) {
  return (
    (Reflect.getMetadata(RELATIONS_METADATA_KEY, entity) as RelationArgs<
      any,
      any
    >[]) || []
  );
}

export const MixField = (
  returnTypeFunction?: ReturnTypeFunc,
  options?: FieldOptions,
) => {
  return decorate(BaseField(returnTypeFunction, options));
};

export const MixProp = (options?: PropOptions) => {
  return decorate(BaseProp(options));
};

export const MixObjectType = (options?: ObjectTypeOptions) => {
  return decorate(ObjectType(options));
};

export const MixSchema = (options?: SchemaOptions) => {
  return decorate(Schema(options));
};
