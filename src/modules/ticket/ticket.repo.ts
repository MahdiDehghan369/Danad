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

export interface IQueryFindTikets {
  user?: string,
  page?: number;
  limit?: number;
  department?: string;
  status?: "open" | "pending" | "closed" | "answered";
}

export const ticketRepo = {
  create: async (data: ICreateTicket): Promise<ITicket> =>
    await ticketModel.create(data),
  findOne: async (condition: object): Promise<ITicket | null> =>
    await ticketModel
      .findOne(condition)
      .select("-__v")
      .populate("user", "fullname username email avatar"),
  deleteOne: async (condition: object): Promise<DeleteResult> =>
    await ticketModel.deleteOne(condition),
  find: async (query?: IQueryFindTikets) => {
    let filterObj: IQueryFindTikets = {};

    if(query?.user){
      filterObj.user = query.user
    }

    if (query?.department) {
      filterObj.department = query.department;
    }

    if(query?.status){
      filterObj.status = query.status
    }

  const limit = query?.limit && query.limit > 0 ? query.limit : 10;
  const page = query?.page && query.page > 0 ? query.page : 1;

    const tickets = await ticketModel
      .find(filterObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ticketModel.countDocuments(filterObj);

    return { tickets, total, page, limit };
  },
};