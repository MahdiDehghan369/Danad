import * as yup from "yup";

export const changePasswordValidator = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must be different from current password"
    ),
});

export const editUserInfoValidator = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  fullname: yup.string().notRequired(),
});

export const userIdValidator = yup.object().shape({
  userId: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export const accountIdValidator = yup.object().shape({
  accountId: yup
    .string()
    .required("Account ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid account ID format"),
});

export const userRoleValidator = yup.object().shape({
  role: yup
    .string()
    .oneOf(["admin", "student", "teacher"], "Invalid user role")
    .required("User role is required"),
});


export const getUsersQueryValidator = yup.object({
  role: yup.string().oneOf(["admin", "teacher" , "student"]).notRequired(),

  limit: yup.number().integer().min(1).max(100).default(10),

  page: yup.number().integer().min(1).default(1),
});