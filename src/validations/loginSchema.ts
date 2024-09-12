import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("Please enter an email"),
  password: yup.string().required("Please enter a password"),
});

export type LoginFormSchema = yup.InferType<typeof loginSchema>;
