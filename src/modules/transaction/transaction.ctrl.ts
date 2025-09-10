import { NextFunction, Request, Response } from "express";
import { getAllTransactionsService, getTransactionService, removeTransactionService } from "./transaction.service";
import { successResponse } from "../../utils/response";
import { ICustomRequest } from "../../middlewares/auth";

export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await getAllTransactionsService(page, limit);

    return successResponse(
      res,
      200,
      "Transactions fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const removeTransaction = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const {tranId} = req.params
        const userId = req.user?._id as string

        await removeTransactionService(tranId , userId)

        return successResponse(res, 200 , "Remove transation successfully")


    } catch (error) {
        next(error)
    }
}

export const getTransaction = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const {tranId} = req.params

        const result = await getTransactionService(tranId)

        return successResponse(res, 200 , "Get transaction successfully" , result)
        
    } catch (error) {
        next(error)
    }
}