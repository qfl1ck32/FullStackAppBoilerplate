import { Inject } from '@nestjs/common';
import { InjectModel as BaseInjectModel } from '@nestjs/mongoose';

import { Constructor } from '@root/defs';

export const InjectModel = (modelClass: Constructor<any>) => {
  return BaseInjectModel(modelClass.name);
};

export const InjectCollection = (modelClass: Constructor<any>) => {
  return Inject(`${modelClass.name}sCollection`);
};
