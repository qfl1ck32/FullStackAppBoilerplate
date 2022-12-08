import { OnSubmitFunction } from '@hooks/useForm/defs';
import { AuthService } from '@libs/auth/auth.service';
import { useStateService } from '@libs/state/state.service';
import { RegisterComponent } from '@root/components/register/Register.component';
import { RegisterUserInputSchema } from '@root/schemas';

export const RegisterContainer = () => {
  const authService = useStateService(AuthService)


  const onSubmit: OnSubmitFunction<typeof RegisterUserInputSchema> = async (input) => {
    console.log(input)

    // await authService.register(input)
  };

  return <RegisterComponent onSubmit={onSubmit}/>
};
