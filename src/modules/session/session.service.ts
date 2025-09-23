import { AppError } from "../../utils/appError"
import { sessionRepo } from "./session.repo"

export const getSessionService = async (sessionId: string) => {

    const session = await sessionRepo.findOne({_id: sessionId})

    if(!session) throw new AppError("Session not found" , 404)

    return {session}

}

export const removeSessionService = async (sessionId: string) => {
    const session = await sessionRepo.findOne({_id: sessionId})

    if(!session) throw new AppError("Session not found" , 404)

    await sessionRepo.deleteOne({_id: sessionId})
}

export const changeStatusSessionService = async (sessionId: string , status: "draft" | "published") => {

    const session = sessionRepo.findOne({_id: sessionId})

    if(!session) throw new AppError("Session not found" , 404)

    const updatedSession = await sessionRepo.findOneAndUpdate({_id: sessionId} , {status})

    return {session: updatedSession}

}

export const changeFreeSessionService = async(sessionId: string , isFree: boolean) => {
    const session = await sessionRepo.findOne({_id: sessionId})

    if(!session) throw new AppError("Session not found" , 404)

    const updatedSession = await sessionRepo.findOneAndUpdate({_id: sessionId}, {isFree})

    return {session: updatedSession}
}