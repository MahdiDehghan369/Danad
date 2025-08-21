import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { changePasswordService } from "./user.service";
import { successResponse } from "../../utils/response";

export const changePassword = async(req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.user?._id

        const {currentPassword , newPassword} = req.body

        await changePasswordService(userId as string, currentPassword , newPassword);

        return successResponse(res, 200 , "Password changed successfully :)")
        
    } catch (error) {
        next(error)
    }
}