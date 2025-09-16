import * as yup from "yup"

export const cartIdValidator = yup.object().shape({
  cartId: yup
    .string()
    .required("cart ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid cart ID format"),
});

export const itemIdValidator = yup.object().shape({
  itemId: yup
    .string()
    .required("item ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid item ID format"),
});

export const applyCouponSchema = yup.object().shape({
  code: yup.string().required()
})