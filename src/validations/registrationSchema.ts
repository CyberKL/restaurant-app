import * as yup from "yup";

export const registerationSchema = yup.object().shape({
  fname: yup.string().required("This field is required"),
  lname: yup.string().required("This field is required"),
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("This field is required"),
  dob: yup
    .date()
    .typeError("Invalid date format")
    .min(new Date("1900-01-01"), "Date of birth cannot be that far in the past")
    .max(new Date(), "Date of birth cannot be in the future")
    .required("This field is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters long")
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+/,
      "Password must contain at least one digit, lowercase letter, uppercase letter, and a special character"
    )
    .required("This field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("This field is required"),
});

export type RegisterFormSchema = yup.InferType<typeof registerationSchema>;
