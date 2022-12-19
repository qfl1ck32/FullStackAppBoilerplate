import { ApolloError } from "@apollo/client"
import { OnSubmitFunction } from "@hooks/useForm/defs"
import { AuthService } from "@libs/auth/auth.service"
import { use } from "@libs/di/hooks/use"
import { useTranslation } from "@libs/i18n/hooks/use-translation"
import { useStateService } from "@libs/state/hooks/use-state-service"
import { LoginComponent } from "@root/components/login/Login.component"
import { NotificationService } from "@root/services/notification/notification.service"
import { getLoginUserInputSchema } from "@root/yup/schema"
import { useCallback } from "react"

export const LoginContainer: React.FC = () => {
    const authService = useStateService(AuthService)

    const notificationService = use(NotificationService)

    const t = useTranslation("auth")

    const onSubmit: OnSubmitFunction<typeof getLoginUserInputSchema> = useCallback(async (input) => {
        try {
            await authService.login(input)

            t("welcome", {
                name: authService.state.user!.fullName
            })
        }

        catch(err: any) {
            console.log(err.graphQLErrors[0])
            console.log(err)
        }
    }, [])

    return <LoginComponent onSubmit={onSubmit} />
}