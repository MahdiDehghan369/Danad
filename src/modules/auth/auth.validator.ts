import * as yup from "yup";

export const registerValidator = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),

  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\+?[0-9]{10,15}$/, "Phone must be a valid number"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});
