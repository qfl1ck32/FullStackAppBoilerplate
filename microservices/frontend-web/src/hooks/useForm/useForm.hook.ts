import { useForm as baseUseForm, FieldValues, UseFormProps as BaseUseFormProps } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export interface UseFormProps<TFieldValues extends FieldValues, TContext = any> extends Omit<BaseUseFormProps<TFieldValues, TContext>, "resolver"> {
  schema: any;
}

export function useForm<TFieldValues extends FieldValues = FieldValues, TContext = any>(props: UseFormProps<TFieldValues, TContext>) {
  const { schema, ...rest } = props;

  return baseUseForm({
    ...rest,

    resolver: yupResolver(schema),
  });
}
