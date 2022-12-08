import { UseFormProps as BaseUseFormProps, FieldValues } from 'react-hook-form';
import { ArraySchema, ObjectSchema } from 'yup';
import { RequiredArraySchema } from 'yup/lib/array';
import BooleanSchema, { RequiredBooleanSchema } from 'yup/lib/boolean';
import DateSchema, { RequiredDateSchema } from 'yup/lib/date';
import NumberSchema, { RequiredNumberSchema } from 'yup/lib/number';
import { Assign, ObjectShape, RequiredObjectSchema } from 'yup/lib/object';
import StringSchema, { RequiredStringSchema } from 'yup/lib/string';

export type ExtractTypeFromSchema<U> = U extends RequiredDateSchema<infer _>
  ? Date
  : U extends DateSchema<infer _>
  ? Date | undefined
  : U extends RequiredStringSchema<infer _>
  ? string
  : U extends StringSchema<infer _>
  ? string | undefined
  : U extends RequiredBooleanSchema<infer _>
  ? boolean
  : U extends BooleanSchema<infer _>
  ? boolean | undefined
  : U extends RequiredNumberSchema<infer _>
  ? number
  : U extends NumberSchema<infer _>
  ? number | undefined
  : U extends RequiredObjectSchema<
      Assign<ObjectShape, infer ObjectSchemaType extends Record<any, any>>,
      infer _,
      infer _2
    >
  ? {
      [Key in keyof ObjectSchemaType]: ExtractTypeFromSchema<
        ObjectSchemaType[Key]
      >;
    }
  : U extends ObjectSchema<
      Assign<ObjectShape, infer ObjectSchemaType extends Record<any, any>>
    >
  ? {
      [Key in keyof ObjectSchemaType]:
        | ExtractTypeFromSchema<ObjectSchemaType[Key]>
        | undefined;
    }
  : U extends RequiredArraySchema<infer ArraySchemaType, infer _, infer _2>
  ? ExtractTypeFromSchema<ArraySchemaType>[]
  : U extends ArraySchema<infer ArraySchemaType, infer _, infer _2>
  ? ExtractTypeFromSchema<ArraySchemaType>[] | undefined
  : null;

export type OnSubmitValues<R> = R extends ObjectSchema<
  Assign<ObjectShape, infer U extends Record<any, any>>
>
  ? {
      [Key in keyof U]: ExtractTypeFromSchema<U[Key]>;
    }
  : any;

export type OnSubmitFunction<R extends (...args: any[]) => any> = (
  input: OnSubmitValues<ReturnType<R>>,
) => void | Promise<void>;

export interface UseFormProps<
  TFieldValues extends FieldValues,
  YupSchemaType extends Record<any, any>,
  TContext = any,
> extends Omit<BaseUseFormProps<TFieldValues, TContext>, 'resolver'> {
  schema: ObjectSchema<Assign<ObjectShape, YupSchemaType>>;
}
