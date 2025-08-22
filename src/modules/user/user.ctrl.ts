import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { changePasswordService, changeUserRoleService, editUserInfoService, getUserInfoService, removeUserService } from "./user.service";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/appError";

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

export const editUserInfo = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.user?._id

        const result = await editUserInfoService(userId as string , req.body)

        return successResponse(res, 200 , "User updated successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const removeUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (req.user?._id == userId.toString()) throw new AppError("You can't remove yourself" , 400)
        
    const result = await removeUserService(userId);

    return successResponse(res, 200, "User removed successfully :)", {
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (req: Request , res:Response , next: NextFunction) => {
    try {

        const {userId} = req.params

        const result = await getUserInfoService(userId)

        return successResponse(res, 200 , "Fetch user info successfully :)" , result)
        
    } catch (error) {
        next(error)
    }
}

export const changeUserRole = async(req: ICustomRequest , res: Response , next:NextFunction) => {
    try {
    
        const {userId} = req.params

        if(req.user?._id == userId.toString()) throw new AppError("You can't change your role :|" , 400)

        const {role} = req.body

        await changeUserRoleService(userId, role)

        return successResponse(res, 200 , "Role changed successfully")

    } catch (error) {
        next(error)
    }
}