export type Constructor<Return = any, Args = any> = new (
  ...args: Args[]
) => Return;

export type Decorator = (
  target: Object,
  key: string | symbol,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor | void;

export declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string;

export declare type NestedPaths<
  Type,
  Depth extends number[],
> = Depth['length'] extends 8
  ? []
  : Type extends
      | string
      | number
      | boolean
      | Date
      | RegExp
      | Buffer
      | Uint8Array
      | ((...args: any[]) => any)
      | {
          _bsontype: string;
        }
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? [] | [number, ...NestedPaths<ArrayType, [...Depth, 1]>]
  : Type extends Map<string, any>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]: Type[Key] extends Type
        ? [Key]
        : Type extends Type[Key]
        ? [Key]
        : Type[Key] extends ReadonlyArray<infer ArrayType>
        ? Type extends ArrayType
          ? [Key]
          : ArrayType extends Type
          ? [Key]
          : [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] // child is not structured the same as the parent
        : [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] | [Key];
    }[Extract<keyof Type, string>]
  : [];
