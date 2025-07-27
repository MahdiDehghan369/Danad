import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../infrastructure/db/mongodb/repositories/userRepository";
import { updateUser } from "../../application/usecases/user/updateUser";
import { ICustomRequest } from "../../application/interfaces/ICustomReq";


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