import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ticketSchema = yup.object({
  department: yup
    .string()
    .matches(objectIdRegex, "Department must be a valid MongoDB ObjectId")
    .required("Department is required"),
  subject: yup.string().required("Subject is required"),
  messages: yup.object({
    message: yup.string().required("Message is required"),
  }),
}); 


export const ticketIdValidator = yup.object().shape({
  ticketId: yup
    .string()
    .required("Ticket ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid ticket ID format"),
});


export const messageTicketSchema = yup.object({
  message: yup.string().required("Message is required"),
});




export const queryFindTicketsSchema = yup.object({
  user: yup
    .string()
    .matches(objectIdRegex, "User must be a valid ObjectId")
    .optional(),
  department: yup
    .string()
    .matches(objectIdRegex, "Department must be a valid ObjectId")
    .optional(),
  status: yup
    .mixed<"open" | "pending" | "closed" | "answered">()
    .oneOf(
      ["open", "pending", "closed", "answered"],
      "Status must be one of: open, pending, closed, answered"
    )
    .optional(),
  page: yup
    .number()
    .typeError("Page must be a number")
    .integer("Page must be an integer")
    .positive("Page must be greater than 0")
    .optional(),
  limit: yup
    .number()
    .typeError("Limit must be a number")
    .integer("Limit must be an integer")
    .positive("Limit must be greater than 0")
    .optional(),
});
