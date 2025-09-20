import { NextFunction, Request, Response } from "express";
import {
  closeTicketService,
  createTicketService,
  getTicketService,
  getTicketsForAdminService,
  removeTicketService,
  sendMessageTicketService,
} from "./ticket.service";
import { ICustomRequest } from "../../middlewares/auth";
import { successResponse } from "../../utils/response";

export const createTicket = async(req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const data = req.body

        data.user = req.user?._id as string

        data.messages = [{
            ...data.messages,
            sender: req.user?._id as string
        }]

        const result = await createTicketService(data)

        return successResponse(res, 200 , "Ticket created successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const sendMessageTicket = async (req: ICustomRequest , res: Response, next: NextFunction) => {
    try {

        const data = req.body

        data.sender = req.user?._id as string

        const result = await sendMessageTicketService(req.params.ticketId , data)

        return successResponse(res, 200 , "Ticket sent successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const closeTicket = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const result = await closeTicketService(req.params.ticketId)

        return successResponse(res, 200 , "Ticket's status changed successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const getTicket = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const result = await getTicketService(req.params.ticketId , req.user?._id as string)

        return successResponse(res, 200 , "Get successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const removeTicket = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        await removeTicketService(req.params.ticketId , req.user?._id as string)

        return successResponse(res , 200 , "Ticket removed successfully")
        
    } catch (error) {
        next(error)
    }
}

export const getTicketsForAdmin = async (req: Request , res: Response , next: NextFunction) => {
    try {

        const result = await getTicketsForAdminService(req.query)

        return successResponse(res, 200 , "Get successfully" , result)
        
    } catch (error) {
        next(error)
    }
}