import * as yup from "yup";
import { Types } from "mongoose";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Helper برای اعتبارسنجی ObjectId
const objectIdTest = (value: any) => {
  if (!value) return false;
  if (typeof value === "string") return objectIdRegex.test(value);
  try {
    const s = value.toString();
    return typeof s === "string" && objectIdRegex.test(s);
  } catch {
    return false;
  }
};

export const createDiscountSchema = yup.object({
  scope: yup
    .mixed<"all" | "single">()
    .oneOf(["all", "single"], "scope must be 'all' or 'single'")
    .required("scope is required"),

  course: yup.lazy((value, options) => {
    const { parent } = options as any;
    if (parent?.scope === "single") {
      return yup
        .mixed()
        .required("course is required when scope is 'single'")
        .test("is-objectid", "course must be a valid ObjectId", objectIdTest);
    }
    return yup.mixed().nullable();
  }),

  type: yup
    .mixed<"percent" | "fixed">()
    .oneOf(["percent", "fixed"], "type must be 'percent' or 'fixed'")
    .required("type is required"),

  value: yup
    .number()
    .typeError("value must be a number")
    .required("value is required")
    .positive("value must be a positive number")
    .test("value-range", "value out of range", function (val) {
      const type = this.parent.type as "percent" | "fixed";
      if (type === "percent") {
        return val != null && val >= 1 && val <= 100;
      }
      return val != null && val >= 1;
    }),

  startAt: yup
    .date()
    .typeError("startAt must be a valid date")
    .nullable()
    .notRequired(),

  endAt: yup
    .date()
    .typeError("endAt must be a valid date")
    .nullable()
    .notRequired()
    .test("end-after-start", "endAt must be after startAt", function (val) {
      const startAt = this.parent.startAt as Date | undefined;
      if (!val || !startAt) return true;
      return val > startAt;
    }),

  isActive: yup.boolean().required("isActive is required"),
});
