import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createArticleSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),

  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),

  shortDescription: yup
    .string()
    .required("Short description is required")
    .max(500, "Short description must be at most 500 characters"),

  content: yup
    .string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters"),


  relatedCourses: yup
    .array()
    .of(
      yup
        .string()
        .matches(objectIdRegex, "Each course must be a valid ObjectId")
    )
    .optional(),

  category: yup
    .string()
    .required("Category is required")
    .matches(objectIdRegex, "Category must be a valid MongoDB ObjectId"),

  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"], "Status must be draft or published")
    .required("Status is required"),

});

export const editArticleSchema = yup.object({
  title: yup.string().required("Title is required").min(3).max(200),
  slug: yup.string().required("Slug is required"),
  shortDescription: yup
    .string()
    .required("Short description is required")
    .min(10)
    .max(500),
  content: yup.string().required("Content is required").min(20),
  relatedCourses: yup
    .array()
    .of(yup.string().matches(objectIdRegex, "Invalid related course id"))
    .optional(),
  category: yup
    .string()
    .required("Category is required")
    .matches(objectIdRegex, "Invalid category id"),
  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"])
    .required("Status is required"),
});

export const articleIdValidator = yup.object().shape({
  articleId: yup
    .string()
    .required("article ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid article ID format"),
});

export const articleStatusSchema = yup.object().shape({
  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"], "Status must be draft or published")
    .required("Status is required"),
});
