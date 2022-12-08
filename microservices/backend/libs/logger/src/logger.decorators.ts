import { applyDecorators } from '@nestjs/common';

import { Decorator } from '@app/core/defs';

export const InjectLogger = () => {
  const decorator: Decorator = (target, key, descriptor) => {
    console.log({ target, key, descriptor });
    console.log(target.constructor);
  };

  return applyDecorators(decorator) as any;
};
