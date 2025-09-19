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

export const querySchema = yup.object({
  page: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : Number(originalValue)
    )
    .min(0, "Page must be greater than or equal to 0")
    .optional(),

  limit: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : Number(originalValue)
    )
    .min(1, "Limit must be greater than or equal to 1")
    .optional(),

  isActive: yup
    .boolean()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        if (originalValue.toLowerCase() === "true") return true;
        if (originalValue.toLowerCase() === "false") return false;
      }
      return value;
    })
    .optional(),
});