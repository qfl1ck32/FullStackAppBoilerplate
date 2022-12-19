import { OnSubmitFunction } from '@hooks/useForm/defs';
import { AuthService } from '@libs/auth/auth.service';
import { useStateService } from '@libs/state/hooks/use-state-service';
import { RegisterComponent } from '@root/components/register/Register.component';
import { getRegisterUserInputSchema } from '@root/yup/schema';
import { useCallback } from 'react';

export const RegisterContainer = () => {
  const authService = useStateService(AuthService)

  const onSubmit: OnSubmitFunction<typeof getRegisterUserInputSchema> = useCallback(async (input) => {
    console.log(input)

    // await authService.register(input)
  }, [])

  return <RegisterComponent onSubmit={onSubmit}/>
};
