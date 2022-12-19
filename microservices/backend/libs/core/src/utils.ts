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
