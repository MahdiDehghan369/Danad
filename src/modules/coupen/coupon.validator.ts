import * as yup from "yup";

export const createCouponSchema = yup.object({
  code: yup.string().required("Coupon code is required").trim().uppercase(),

  type: yup
    .mixed<"percent" | "fixed">()
    .oneOf(["percent", "fixed"], "Type must be 'percent' or 'fixed'")
    .required("Type is required"),
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
    .typeError("Start date must be a valid date")
    .required("Start date is required"),

  endAt: yup
    .date()
    .typeError("End date must be a valid date")
    .required("End date is required")
    .min(yup.ref("startAt"), "End date must be after start date"),

  isActive: yup.boolean().notRequired(),
});

export const couponIdValidator = yup.object().shape({
  couponId: yup
    .string()
    .required("Coupon ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Coupon ID format"),
});


export const editCouponSchema = yup.object({
  code: yup.string().required("Coupon code is required").trim().uppercase(),

  type: yup
    .mixed<"percent" | "fixed">()
    .oneOf(["percent", "fixed"], "Type must be 'percent' or 'fixed'")
    .required("Type is required"),

  value: yup
    .number()
    .typeError("Value must be a number")
    .required("Value is required")
    .positive("Value must be greater than 0")
    .test("value-range", "Value out of range", function (val) {
      const type = this.parent.type as "percent" | "fixed";
      if (type === "percent") {
        return val != null && val >= 1 && val <= 100;
      }
      return val != null && val >= 1;
    }),

  startAt: yup
    .date()
    .typeError("Start date must be a valid date")
    .required("Start date is required"),

  endAt: yup
    .date()
    .typeError("End date must be a valid date")
    .required("End date is required")
    .min(yup.ref("startAt"), "End date must be after start date"),

  isActive: yup.boolean().required("isActive is required"),
});
