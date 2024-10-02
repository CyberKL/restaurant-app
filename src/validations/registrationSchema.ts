import * as yup from "yup";

export const createRegistrationSchema = (t: Function) => {
  return yup.object().shape({
    fname: yup.string().required(t('register.validations.missing')),
    lname: yup.string().required(t('register.validations.missing')),
    email: yup
      .string()
      .email(t('register.validations.email'))
      .required(t('register.validations.missing')),
    dob: yup
      .date()
      .typeError(t('register.validations.dob.invalid'))
      .min(new Date("1900-01-01"), t('register.validations.dob.min'))
      .max(new Date(), t('register.validations.dob.max'))
      .required(t('register.validations.missing')),
    password: yup
      .string()
      .min(8, t('register.validations.password.min'))
      .max(32, t('register.validations.password.max'))
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+/,
        t('register.validations.password.matches')
      )
      .required(t('register.validations.missing')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t('register.validations.confirmPass'))
      .required(t('register.validations.missing')),
  });
};

export type RegisterFormSchema = yup.InferType<ReturnType<typeof createRegistrationSchema>>;
