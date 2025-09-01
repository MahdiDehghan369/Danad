import * as yup from "yup";

export const categorySchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot be longer than 100 characters"),

  slug: yup
    .string()
    .required("Slug is required")
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug cannot be longer than 50 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot be longer than 500 characters"),

  type: yup
    .string()
    .oneOf(["blog", "course"], "Type must be either blog or course")
    .required("Type is required"),

  status: yup
    .string()
    .oneOf(["active", "inactive"], "Status must be either active or inactive")
    .notRequired(),

  parent: yup
    .string()
    .notRequired()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
});

export const categoryIdValidator = yup.object().shape({
  categoryId: yup
    .string()
    .required("Category ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
});
