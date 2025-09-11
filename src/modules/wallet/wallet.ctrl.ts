import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { depositService, editInventoryService, getTransactionsService, getWalletBalanceService, giftDepositService } from "./wallet.service";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/appError";

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

export const giftDeposit = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.params.userId as string

        if (userId.toString() == req.user?._id as string) {
          throw new AppError("You cannot gift yourself", 400);
        }


        const result = await giftDepositService(userId , req.body)

        return successResponse(res, 200 , "Successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const editInventory = async(req: Request , res: Response , next: NextFunction) => {
    try {

        const {userId} = req.params

        const result = await editInventoryService(userId , req.body)

        return successResponse(res, 200, "Inventory edited successfully" , result);
        
    } catch (error) {
        next(error)
    }
}
