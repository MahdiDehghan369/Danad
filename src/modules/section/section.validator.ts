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

export const sectionStatusSchema = yup.object().shape({
  status: yup.string().oneOf(["draft", "published"]).required()
})

export const editSectionSchema = yup.object({
  course: yup
    .string()
    .required("Course ID is required.")
    .trim()
    .matches(objectIdRegex, "Course ID must be a valid MongoDB ObjectId."),

  title: yup
    .string()
    .required("Section title is required.")
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(150, "Title cannot exceed 150 characters."),

  description: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === undefined) return null;
      return typeof value === "string" ? value.trim() : value;
    })
    .max(2000, "Description cannot exceed 2000 characters."),

  order: yup
    .number()
    .typeError("Order must be a number.")
    .required("Order is required.")
    .integer("Order must be an integer.")
    .min(0, "Order cannot be negative."),

  status: yup
    .mixed<"draft" | "published">()
    .required("Status is required.")
    .oneOf(
      ["draft", "published"],
      "Status must be either 'draft' or 'published'."
    ),
});