import { getRegisterUserInputSchema } from '@root/yup/schema';

import { OnSubmitFunction } from '@hooks/useForm/defs';

export interface IRegisterComponentProps {
  onSubmit: OnSubmitFunction<typeof getRegisterUserInputSchema>;
}
