import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../infrastructure/db/mongodb/repositories/userRepository";
import { updateUser } from "../../application/usecases/user/updateUser";
import { ICustomRequest } from "../../application/interfaces/ICustomReq";
import { removeUserByAdmin } from "../../application/usecases/user/removeUser";
import { getUserInformation } from "../../application/usecases/user/getUserInfo";


export const updateUserInfo = async(req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req?.user?._id as string

        const userRepo = new userRepository()
        const updatedUserUseCase = new updateUser(userRepo)

        const data = await updatedUserUseCase.execute(userId , req?.body)

        return res.status(201).json({
            success: true,
            message: "Updated successfully",
            data: {
                user: data.user
            }
        })
        
    } catch (error) {
        next(error)
    }
}

export const removeUser = async(req:Request , res: Response , next: NextFunction) => {
    try {

        const {userId} = req?.params

        const userRepo = new userRepository()
        const removeUserUseCase = new removeUserByAdmin(userRepo)

        const data = await removeUserUseCase.execute(userId)

        return res.status(200).json({
            success: true,
            message: "User removed successfully"
        })
        
    } catch (error) {
        next(error)
    }
}

export const getUserInfo = async (req:Request , res: Response , next: NextFunction) => {
    try {

        const {userId} = req?.params

        const userRepo = new userRepository()
        const getUserInfoUseCase = new getUserInformation(userRepo)

        const data = await getUserInfoUseCase.exeute(userId)

        return res.status(200).json({
            success: true,
            data: {
                user: data.user
            }
        })
        
    } catch (error) {
        next(error)
    }
}