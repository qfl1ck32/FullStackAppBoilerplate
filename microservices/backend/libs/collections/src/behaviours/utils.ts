import { SetMetadata, applyDecorators } from '@nestjs/common';

import { Constructor } from '@app/core/defs';

import {
  BehaviourFunction,
  BehaviourOptions,
  BehaviourWithOptions,
} from '../defs';

export function SetBehaviourOptions<T>(
  behaviour: Constructor<T> | Function,
  options: BehaviourOptions<T>,
) {
  return SetMetadata(
    `Behaviour.${behaviour.name.toLowerCase()}.options`,
    options,
  );
}

export function AddBehaviour<T>(
  behaviour: BehaviourFunction<T>,
  options?: BehaviourOptions<T>,
) {
  const decorators = [
    SetMetadata(`Behaviour.${behaviour.name.toLowerCase()}`, behaviour),
  ];

  if (options) {
    decorators.push(SetBehaviourOptions(behaviour, options));
  }

  return applyDecorators(...decorators);
}

export function getBehavioursWithOptions<T>(entity: Constructor<T>) {
  const keys = Reflect.getMetadataKeys(entity) as string[];

  const behaviourKeys = keys
    .filter((key) => key.startsWith('Behaviour.'))
    .filter((key) => !key.endsWith('.options'));

  return behaviourKeys.map((key) => ({
    behaviour: Reflect.getMetadata(key, entity),
    options: Reflect.getMetadata(`${key}.options`, entity),
  })) as BehaviourWithOptions[];
}
