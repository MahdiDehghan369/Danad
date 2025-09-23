import * as yup from "yup"

export const sessionIdValidator = yup.object().shape({
  sessionId: yup
    .string()
    .required("session ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid session ID format"),
});

export const sessionStatusSchema = yup.object().shape({
  status: yup.string().oneOf(["draft", "published"]).required()
})

export const sessionFreeSchema = yup.object().shape({
  isFree: yup.boolean().required(),
});