import { Types } from "mongoose";
import { AppError } from "../../utils/appError";
import { departmentRepo } from "../department/department.repo";
import { userRepo } from "../user/user.repo";
import { ICreateTicket, IMessageTicket, ticketRepo } from "./ticket.repo";

export const createTicketService = async (data: ICreateTicket) => {
  const user = await userRepo.findById(data.user);

  if (!user) throw new AppError("User not found", 404);

  const department = await departmentRepo.findOne({ _id: data.department });

  if (!department) throw new AppError("Department not found", 404);

  data.status = "pending";

  const ticket = await ticketRepo.create(data);

  return { ticket };
};

export const sendMessageTicketService = async (
  ticketId: string,
  data: IMessageTicket
) => {
  const user = await userRepo.findById(data.sender);

  if (!user) throw new AppError("user not found", 404);

  const ticket = await ticketRepo.findOne({ _id: ticketId });

  if (!ticket) throw new AppError("Ticket not found", 404);

  if (ticket.status === "closed")
    throw new AppError("Ticket is closed and you can not send a message", 400);

  if (user.role !== "admin" && ticket.user.toString() !== data.sender) {
    throw new AppError("You do not have access to send message", 403);
  }

  const newMessage = {
    sender: new Types.ObjectId(data.sender),
    message: data.message,
    createdAt: new Date(),
  };

  ticket.messages.push(newMessage);

  if (user.role === "admin") {
    ticket.status = "answered";
  } else if (user.role === "student") {
    ticket.status = "pending";
  }

  await ticket.save();

  return { ticket };
};

export const closeTicketService = async (ticketId: string) => {
  const ticket = await ticketRepo.findOne({ _id: ticketId });

  if (!ticket) throw new AppError("Ticket not found", 404);

  ticket.status = "closed";
  ticket.closedAt = new Date();

  await ticket.save();

  return { ticket };
};

export const getTicketService = async (ticketId: string, userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const ticket = await ticketRepo.findOne({ _id: ticketId });

  if (!ticket) throw new AppError("Ticket not found", 404);

  if (user.role !== "admin" && ticket.user.toString() !== userId) {
    throw new AppError("You do not have access to get ticket", 403);
  }

  return { ticket };
};

export const removeTicketService = async (ticketId: string, userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("user not found", 404);

  const ticket = await ticketRepo.findOne({ _id: ticketId });

  if (!ticket) throw new AppError("Ticket not found", 404);

  if (user.role !== "admin" && ticket.user.toString() !== userId) {
    throw new AppError("You do not have access to remove ticket", 403);
  }

  await ticketRepo.deleteOne({_id: ticketId})
};
