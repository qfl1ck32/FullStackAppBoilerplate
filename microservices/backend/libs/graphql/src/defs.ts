import {
  ID as BaseID,
  registerEnumType as baseRegisterEnumType,
} from '@nestjs/graphql';

import { ObjectId } from '@app/collections/defs';

import { Request } from 'express';

export const ROLES_KEY = 'ROLES';

export type GQLContext = {
  req: Request;
  userId?: ObjectId;
};

export const Id = BaseID;

/**
 *
 * @param enumObject An object that contains one element - the enum
 * @returns
 */
export const registerEnumType = (enumObject: any) => {
  const keys = Object.keys(enumObject);

  if (keys.length !== 1) {
    throw new Error(
      'When registering an enum, you must pass an object that contains one element - the enum',
    );
  }

  const name = keys[0];
  const Enum = enumObject[name];

  return baseRegisterEnumType(Enum, {
    name,
  });
};
