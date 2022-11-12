import { applyDecorators } from '@nestjs/common';

import { Constructor, Decorator } from '@app/core/defs';

import { RelationArgs } from './defs';

const RELATIONS_METADATA_KEY = 'COLLECTION.RELATIONS';

function AddRelation<From, To>(relation: RelationArgs<From, To>) {
  // TODO: this can be optimised a bit - declare the array once, in "Relations()"
  const decoratorFactory: Decorator = (target) => {
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
