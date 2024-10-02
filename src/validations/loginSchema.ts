// loginValidation.ts
import * as yup from "yup";

// Function to create the login schema with translations
export const createLoginSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    email: yup
      .string()
      .email(t('login.validations.email.invalid'))
      .required(t('login.validations.email.empty')),
    password: yup.string().required(t('login.validations.password')),
  });
};

export type LoginFormSchema = yup.InferType<ReturnType<typeof createLoginSchema>>;
