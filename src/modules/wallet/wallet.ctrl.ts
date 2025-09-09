import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";

export const deposit = async(req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.user?._id
        
    } catch (error) {
        next(error)
    }
}