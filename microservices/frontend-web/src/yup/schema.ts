import { yup } from '@libs/yup/yup.service';    ;

export const getIssueAccessTokenInputSchema = () => yup.object().shape({
  refreshToken: yup.string().required()
})

export const getLoginUserInputSchema = () => yup.object().shape({
  usernameOrEmail: yup.string().required(),
  password: yup.string().required()
})

export const getRegisterUserInputSchema = () => yup.object().shape({
  firstName: yup.string().notRequired(),
  lastName: yup.string().notRequired(),
  username: yup.string().notRequired(),
  email: yup.string().email().required(),
  password: yup.string().max(12).min(8).required()
})

export const getEndUsersTodosCreateInputSchema = () => yup.object().shape({
  title: yup.string().required()
})