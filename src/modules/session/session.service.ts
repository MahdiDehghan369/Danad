import { AppError } from "../../utils/appError"
import { purchasedCourseRepo } from "../purchasedCourse/purchasedCourse.repo"
import { userRepo } from "../user/user.repo"
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

export const watchSessionService = async (sessionId: string , userId: string) => {

    const session = await sessionRepo.findOne({_id: sessionId})

    if(!session) throw new AppError("Session not found" , 404)

    const user = await userRepo.findById(userId)

    if(!user) throw new AppError("User not found" , 404)

    if (!session.isFree) {
      const userBoughtCourse = await purchasedCourseRepo.findOne({
        course: session.course,
        user: userId,
      });

      if (!userBoughtCourse) {
        throw new AppError("You don't have access to watch this session", 403);
      }
    }

    return {session}

}