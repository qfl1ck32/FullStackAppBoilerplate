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
