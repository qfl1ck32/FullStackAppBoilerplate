import { OnSubmitFunction } from "@hooks/useForm/defs"
import { AuthService } from "@libs/auth/auth.service"
import { useStateService } from "@libs/state/hooks/use-state-service"
import { LoginComponent } from "@root/components/login/Login.component"
import { getLoginUserInputSchema } from "@root/yup/schema"
import { useCallback } from "react"

export const LoginContainer: React.FC = () => {
    const authService = useStateService(AuthService)

    const onSubmit: OnSubmitFunction<typeof getLoginUserInputSchema> = useCallback(async (input) => {
        console.log(input)
    }, [])

    return <LoginComponent onSubmit={onSubmit} />
}