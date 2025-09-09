import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { depositService, getTransactionsService, getWalletBalanceService } from "./wallet.service";
import { successResponse } from "../../utils/response";

export const deposit = async(req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.user?._id

        const result = await depositService(userId as string , req.body)

        return successResponse(res , 200 , "Deposit successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const getTransactions = async (req: ICustomRequest , res: Response , next: NextFunction) => {{
    try {

        const userId = req.user?._id as string

        const result = await getTransactionsService(userId)

        return successResponse(res, 200 , "Fetch all transactions successfully" , result)
        
    } catch (error) {
        next(error)
    }
}}

export const getWalletBalance = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.user?._id as string

        const result = await getWalletBalanceService(userId)

        return successResponse(res, 200 , "Get balance successfully" , result)
        
    } catch (error) {
        next(error)
    }
}