import { getLoginUserInputSchema } from '@root/yup/schema';

import { OnSubmitFunction } from '@hooks/useForm/defs';

export interface ILoginComponentProps {
  onSubmit: OnSubmitFunction<typeof getLoginUserInputSchema>;
}
