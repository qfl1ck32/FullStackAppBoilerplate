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
