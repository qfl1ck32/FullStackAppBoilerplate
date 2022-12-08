import { yup } from '@libs/yup/yup.service';

export const IssueAccessTokenInputSchema = yup.object().shape({
  refreshToken: yup.string().required(),
});

export const LoginUserInputSchema = yup.object().shape({
  usernameOrEmail: yup.string().required(),
  password: yup.string().required(),
});

export const RegisterUserInputSchema = yup.object().shape({
  firstName: yup.string().notRequired(),
  lastName: yup.string().notRequired(),
  username: yup.string().notRequired(),
  email: yup.string().email().required(),
  password: yup.string().max(12).min(8).required(),
});
