import { ObjectAssignFunctionType } from './defs';

import { MergeDeepArgs } from '../defs';

/**
 * Not the best, but... it works.
 */
export const replaceEnumAtRuntime = (previousEnum: any, newEnum: any) => {
  Object.keys(previousEnum).forEach((key) => {
    delete previousEnum[key];
  });
  Object.keys(newEnum).forEach((key) => {
    previousEnum[key] = newEnum[key];
  });
};

/**
 *
 * @param value The value that should be an array
 * @returns The value as an array
 */
export const makeArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
};

const objectAssign: ObjectAssignFunctionType = (target, source, key) => {
  Object.assign(target, {
    [key]: source[key],
  });
};

/**
 *
 * @param args: An object containning the target, the sources and the assign function (defaults to Object.assign (kinda))
 * @returns Nothing. Don' wait.
 */
export const mergeDeep = async (args: MergeDeepArgs) => {
  const { sources, target } = args;

  const assignFunction = args.assignFunction || objectAssign;

  if (!sources.length) return target;

  const source = sources.shift();

  if (target instanceof Object && source instanceof Object) {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        await mergeDeep({
          target: target[key],
          assignFunction,
          sources: [source[key]],
        });
      } else {
        await assignFunction(target, source, key);
      }
    }
  }

  return mergeDeep({
    target,
    assignFunction,
    sources,
  });
};
