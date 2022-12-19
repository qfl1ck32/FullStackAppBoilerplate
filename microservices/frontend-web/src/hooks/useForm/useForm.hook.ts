import { yupResolver } from '@hookform/resolvers/yup';
import { use } from '@libs/di/hooks/use';
import { I18nService } from '@libs/i18n/i18n.service';
import { useEffect } from 'react';
import { FieldValues, useForm as baseUseForm } from 'react-hook-form';

import { OnSubmitValues, UseFormProps } from './defs';

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  YupSchemaType extends {} = {},
  TContext = any,
>(props: UseFormProps<TFieldValues, YupSchemaType, TContext>) {
  const { schema, ...rest } = props;

  const i18nService = use(I18nService);

  const form = baseUseForm<OnSubmitValues<typeof schema>>({
    ...rest,

    resolver: yupResolver(schema),
  } as any);

  useEffect(() => {
    form.trigger(Object.keys(form.formState.errors) as any);
  }, [i18nService.activePolyglot]);

  const getErrorMessage = (field: keyof YupSchemaType) =>
    form.formState.errors[field]?.message;

  return {
    ...form,
    getErrorMessage,
  };
}
