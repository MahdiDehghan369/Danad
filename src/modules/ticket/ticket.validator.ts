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