import * as yup from "yup";


export const tranIdValidator = yup.object().shape({
  tranId: yup
    .string()
    .required("Tran ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid tran ID format"),
});