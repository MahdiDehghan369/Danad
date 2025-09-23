import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSessionSchema = yup.object({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),

  description: yup
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  videoDuration: yup
    .number()
    .min(0, "Video duration cannot be negative"),

  isFree: yup.boolean(),

  order: yup.number().min(1, "Order must be greater than 0"),

  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"], "Status must be 'draft' or 'published'"),
});

export const sectionIdValidator = yup.object().shape({
  sectionId: yup
    .string()
    .required("section ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid section ID format"),
});

export const sessionFilterSchema = yup.object({
  status: yup.string().oneOf(["draft", "published"]).optional(),

  isFree: yup.boolean().optional(),

  page: yup
    .number()
    .integer("Page must be an integer")
    .min(1, "Page must be at least 1")
    .optional(),

  limit: yup
    .number()
    .integer("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .optional()
});