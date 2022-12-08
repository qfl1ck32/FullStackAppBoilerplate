import { injectable } from 'inversify';
import 'reflect-metadata';

import { container } from './container';

import { Decorator } from '../core/defs';

export const Injectable = injectable;
export const Inject = () => {
  const decorator: Decorator = (target, key, _) => {
    const identifier = Reflect.getMetadata('design:type', target, key);

    try {
      const instance = container.get(identifier);

      Reflect.set(target, key, instance);

      return target;
    } catch (err) {
      // server side?
    }
  };

  // TODO: type
  return decorator as any;
};
