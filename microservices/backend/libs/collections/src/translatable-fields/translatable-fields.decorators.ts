import { applyDecorators } from '@nestjs/common';

import { Decorator } from '@app/core/defs';

const TRANSLATABLE_FIELDS_METADATA_KEY = 'COLLECTION.TRANSLATABLE_FIELDS';

export const Translatable = () => {
  const decorator: Decorator = (target, key) => {
    const existingFields =
      Reflect.getMetadata(
        TRANSLATABLE_FIELDS_METADATA_KEY,
        target.constructor,
      ) || [];

    Reflect.defineMetadata(
      TRANSLATABLE_FIELDS_METADATA_KEY,
      [...existingFields, key],
      target.constructor,
    );
  };

  return applyDecorators(decorator);
};

export const getTranslatableFields = <T>(target: any) => {
  return Reflect.getMetadata(TRANSLATABLE_FIELDS_METADATA_KEY, target) || [];
};
