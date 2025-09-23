import { NextFunction, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { changeFreeSessionService, changeStatusSessionService, getAllSessionsService, getSessionService, removeSessionService, watchSessionService } from "./session.service";
import { successResponse } from "../../utils/response";

export const getSession = async (req: ICustomRequest , res: Response, next: NextFunction) => {
    try {

        const sessionId = req.params.sessionId

        const result = await getSessionService(sessionId)

        return successResponse(res, 200 , "Get session successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const removeSession = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const sessionId = req.params.sessionId

        await removeSessionService(sessionId)

        return successResponse(res, 200 , "Session removed successfully")
        
    } catch (error) {
        next(error)
    }
}

export const changeStatusSession = async (req: ICustomRequest , res: Response, next: NextFunction) => {
    try {

        const sessionId = req.params.sessionId

        const result = await changeStatusSessionService(sessionId , req.body.status)

        return successResponse(res, 200 , "Status changed successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const changeFreeSession = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {
    
        const sessionId = req.params.sessionId

        const result = await changeFreeSessionService(sessionId , req.body.isFree)

        return successResponse(res, 200 , "IsFree changed successfully" , result)

    } catch (error) {
        next(error)
    }
}

export const watchSession = async (req: ICustomRequest , res: Response, next: NextFunction) => {
    try {

        const sessionId = req.params.sessionId
        const userId = req.user?._id as string

        const result = await watchSessionService(sessionId , userId)

        return successResponse(res, 200 , "Get successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const getAllSessions = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const result = await getAllSessionsService(req.query)

        return successResponse(res, 200 , "get successfully" , result)
        
    } catch (error) {
        next(error)
    }
}