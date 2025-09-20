import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { closeTicket, createTicket, getTicket, getTicketsForAdmin, removeTicket, sendMessageTicket } from "./ticket.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { messageTicketSchema, queryFindTicketsSchema, ticketIdValidator, ticketSchema } from "./ticket.validator";
import { paramValidator } from "../../middlewares/paramValidator";
import { checkRole } from "../../middlewares/checkRole";
import { queryValidator } from "../../middlewares/queryValidator";
const router = Router()

router
  .route("/")
  .post(authMiddleware, bodyValidator(ticketSchema), createTicket)
  .get(
    authMiddleware,
    checkRole("admin"),
    queryValidator(queryFindTicketsSchema),
    getTicketsForAdmin
  );

router.route("/:ticketId").get(authMiddleware , paramValidator(ticketIdValidator) , getTicket).delete(authMiddleware , paramValidator(ticketIdValidator) , removeTicket)

router
  .route("/:ticketId/reply")
  .post(
    authMiddleware,
    paramValidator(ticketIdValidator),
    bodyValidator(messageTicketSchema),
    sendMessageTicket
  );

router
  .route("/:ticketId/close")
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(ticketIdValidator),
    closeTicket
  );

export default router