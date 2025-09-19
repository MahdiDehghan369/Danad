import * as yup from "yup";

export const createDepartmentSchema = yup.object({
  name: yup
    .string()
    .required("Department name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot be more than 50 characters"),

  slug: yup.string().required("Slug is required"),

  description: yup
    .string()
    .max(200, "Description cannot be more than 200 characters")
    .optional(),

  isActive: yup.boolean().default(true).optional(),
});


export const editDepartmentSchema = yup.object({
  name: yup
    .string()
    .required("Department name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot be more than 50 characters"),

  slug: yup.string().required("Slug is required"),

  description: yup
    .string()
    .max(200, "Description cannot be more than 200 characters")
    .optional(),

  isActive: yup.boolean().required(),
});


export const departmentIdValidator = yup.object().shape({
  departmentId: yup
    .string()
    .required("Department ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid department ID format"),
});

