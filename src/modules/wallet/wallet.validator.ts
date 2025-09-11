import * as yup from "yup";

export const depositSchema = yup.object().shape({
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  amount: yup
    .number()
    .required("Amount is required")
    .min(0, "Amount cannot be negative"),

  gateway: yup
    .mixed<"zarinpal" | "manual">()
    .oneOf(["zarinpal", "manual"], "Invalid gateway")
    .required(),
});

export const editInventorySchema = yup.object().shape({
  amount: yup
    .number()
    .required("Amount is required")
    .min(0, "Amount cannot be negative"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
});