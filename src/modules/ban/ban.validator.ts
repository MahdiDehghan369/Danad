import * as yup from "yup";

export const banUserValidator = yup.object().shape({
  user: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
  reason: yup
    .string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason must be at most 200 characters"),
  endAt: yup
    .date()
    .min(new Date(), "End date must be in the future")
    .notRequired()
    .nullable(),
});

export const userIdValidator = yup.object().shape({
  userId: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export const getBanUsersQueryValidator = yup.object({
  status: yup.string().oneOf(["active", "expired"]).notRequired(),

  bannedBy: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")
    .notRequired(),

  limit: yup.number().integer().min(1).max(100).default(10),

  page: yup.number().integer().min(1).default(1),
});

export const editBanValidator = yup.object().shape({
  reason: yup
    .string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason must be at most 200 characters"),
  endAt: yup
    .date()
    .min(new Date(), "End date must be in the future")
    .notRequired()
    .nullable(),
});

export const banIdValidator = yup.object().shape({
  banId: yup
    .string()
    .required("Ban ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid ban ID format"),
});
