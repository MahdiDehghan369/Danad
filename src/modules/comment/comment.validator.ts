import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createCommentSchema = yup.object({
  course: yup
    .string()
    .matches(objectIdRegex, "Course must be a valid MongoDB ObjectId")
    .required("Course is required"),

  parentComment: yup
    .string()
    .matches(objectIdRegex, "ParentComment must be a valid MongoDB ObjectId")
    .optional(),

  content: yup
    .string()
    .trim()
    .min(1, "Content cannot be empty")
    .required("Content is required"),

});


export const commentIdValidator = yup.object().shape({
  commentId: yup
    .string()
    .required("comment ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid comment ID format"),
});

export const statusCommentSchema = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["approved", "rejected"],
      "Status must be either 'approved' or 'rejected'"
    ),
});