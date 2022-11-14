import { SetMetadata } from '@nestjs/common';

import { Constructor } from '@app/core/defs';

import { AddBehaviourType, BehaviourFunction } from '../defs';

export const AddBehaviour = (behaviour: AddBehaviourType) => {
  return SetMetadata(`Behaviour.${behaviour.name}`, behaviour);
};

export function getBehaviours<T>(entity: Constructor<T>) {
  const keys = Reflect.getMetadataKeys(entity) as string[];

  return keys
    .filter((key) => key.startsWith('Behaviour.'))
    .map((key) => Reflect.getMetadata(key, entity));
}
