import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});
