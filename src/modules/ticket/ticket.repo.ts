import { DeleteResult } from "mongoose";
import ticketModel, { ITicket } from "./ticket.model"

export interface IMessageTicket {
    sender: string,
    message: string,
}

export interface ICreateTicket {
  user: string;
  department: string;
  subject: string;
  messages: IMessageTicket;
  status?: "open" | "pending" | "closed" | "answered";
}

export const ticketRepo = {
    create: async(data: ICreateTicket) : Promise<ITicket> => await ticketModel.create(data),
    findOne: async (condition: object) : Promise<ITicket | null> => await ticketModel.findOne(condition).select("-__v").populate("user" , "fullname username email avatar"),
    deleteOne: async (condition: object) : Promise <DeleteResult> => await ticketModel.deleteOne(condition)
}