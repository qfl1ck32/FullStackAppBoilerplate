import { OnSubmitFunction } from '@hooks/useForm/defs';
import { AuthService } from '@libs/auth/auth.service';
import { use } from '@libs/di/hooks/use';
import { useTranslation } from '@libs/i18n/hooks/use-translation';
import { I18nService } from '@libs/i18n/i18n.service';
import { useStateService } from '@libs/state/hooks/use-state-service';
import { RegisterComponent } from '@root/components/register/Register.component';
import { NotificationService } from '@root/services/notification/notification.service';
import { getRegisterUserInputSchema } from '@root/yup/schema';
import { useCallback } from 'react';

export const RegisterContainer = () => {
  const authService = useStateService(AuthService)
  const i18nService = use(I18nService)
  const notificationService = use(NotificationService)

  const t = useTranslation("auth")

  const onSubmit: OnSubmitFunction<typeof getRegisterUserInputSchema> = useCallback(async (input) => {
    try {
      await authService.register(input)

      notificationService.show.info(t("successfullyRegistered"))
    }

    catch(err: any) {
      const errorMessage = i18nService.translateError(err)

      notificationService.show.error(errorMessage)
    }

  }, [])

  return <RegisterComponent onSubmit={onSubmit}/>
};
