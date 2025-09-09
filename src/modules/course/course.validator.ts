import * as yup from "yup";

export const createCourseSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  slug: yup.string().required("Slug is required"),

  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price cannot be negative"),

  status: yup
    .mixed<"completed" | "pending" | "draft">()
    .oneOf(["completed", "pending", "draft"], "Invalid status")
    .notRequired(),

  category: yup
    .string()
    .required("Category ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),

  level: yup
    .mixed<"beginner" | "intermediate" | "advanced">()
    .oneOf(["beginner", "intermediate", "advanced"], "Invalid level")
    .notRequired(),

  language: yup.string().required("Language is required"),

  teacher: yup
    .string()
    .required("Teacher ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid teacher ID format"),

  prerequisites: yup.array().of(yup.string()).required(),
});


export const updateCourseSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters"),

  slug: yup.string(),

  price: yup.number().min(0, "Price cannot be negative"),

  status: yup
    .mixed<"completed" | "pending" | "draft">()
    .oneOf(["completed", "pending", "draft"], "Invalid status")
    .notRequired(),

  category: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format")
    .notRequired(),

  level: yup
    .mixed<"beginner" | "intermediate" | "advanced">()
    .oneOf(["beginner", "intermediate", "advanced"], "Invalid level")
    .notRequired(),

  language: yup.string(),

  teacher: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid teacher ID format")
    .notRequired(),

  prerequisites: yup.array().of(yup.string()).notRequired(),
});



export const courseIdValidator = yup.object().shape({
  courseId: yup
    .string()
    .required("course ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid course ID format"),
});

export const statusCourse = yup.object().shape({
  status: yup
    .mixed<"completed" | "pending" | "draft">()
    .oneOf(["completed", "pending", "draft"], "Invalid status").required()
});

export const teacherIdValidator = yup.object().shape({
  teacher: yup
    .string()
    .required("Teacher ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Teacher ID format"),
});