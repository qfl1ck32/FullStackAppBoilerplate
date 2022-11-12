import { SetMetadata } from '@nestjs/common';

import { Constructor } from '@app/core/defs';

import { BehaviourFunction } from '../defs';

export const AddBehaviour = (behaviour: BehaviourFunction) => {
  return SetMetadata(`Behaviour.${behaviour.name}`, behaviour);
};

export function getBehaviours<T>(model: Constructor<T>) {
  const keys = Reflect.getMetadataKeys(model) as string[];

  return keys
    .filter((key) => key.startsWith('Behaviour.'))
    .map((key) => Reflect.getMetadata(key, model));
}
