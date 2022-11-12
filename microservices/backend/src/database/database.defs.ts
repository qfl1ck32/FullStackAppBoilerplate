import { Constructor } from '@root/defs';

export interface RelationArgs<From = any, To = any> {
  field: keyof From;

  fieldId?: keyof From;

  to: () => Constructor<To>;

  // MAGIC: we could've left "keyof To" as the type, but then
  // relation.inversedBy has type "string | symbol | idk"
  // this way, we get the best of both worlds - we have autocomplete from "to"
  // and we know that it's a string
  // maybe the solution would be to have <From = any, To extends ???? string ??= any>

  inversedBy?: keyof To extends string ? keyof To : string;

  isArray?: boolean;
}

export type SimpleFieldValue = 1 | true;

export type Flatten<T> = T extends (infer U)[]
  ? U
  : T extends object
  ? keyof T
  : T;

export type QueryBodyType<T> = {
  [K in keyof T]?: T[K] extends string
    ? SimpleFieldValue
    : SimpleFieldValue | QueryBodyType<Flatten<T[K]>>;
};
