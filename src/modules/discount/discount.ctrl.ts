import { NextFunction, Request, Response } from "express";
import { createCourseDiscountService } from "./discount.service";
import { successResponse } from "../../utils/response";

export const createCourseDiscount = async (req: Request , res: Response , next: NextFunction) => {
    try {

        const result = await createCourseDiscountService(req.body)

        return successResponse(res, 200 , "Discount created successfully" , result)
        
    } catch (error) {
        next(error)
    }
}