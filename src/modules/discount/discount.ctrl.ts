import { NextFunction, Request, Response } from "express";
import {
    changeStatusDiscountService,
  createCourseDiscountService,
  getCourseDiscountService,
  getCourseDiscountsService,
  removeCourseDiscountService,
  updateCourseDiscountService,
} from "./discount.service";
import { successResponse } from "../../utils/response";

export const createCourseDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createCourseDiscountService(req.body);

    return successResponse(res, 200, "Discount created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeCourseDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeCourseDiscountService(req.params.discountId);

    return successResponse(res, 200, "Discount removed successfully");
  } catch (error) {
    next(error);
  }
};

export const changeStatusDiscount = async (req: Request , res: Response , next: NextFunction) => {
    try {

        const result = await changeStatusDiscountService(req.params?.discountId)

        return successResponse(res, 200 , "Updated successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const getCourseDiscount = async (req: Request , res: Response , next: NextFunction) => {
    try {
        
        const result = await getCourseDiscountService(req.params.discountId)

        return successResponse(res, 200 , "Fetch course discount info successfully" , result)

    } catch (error) {
        next(error)
    }
}

export const updateCourseDiscount = async (req: Request, res: Response) => {
    const result = await updateCourseDiscountService(req.params.discountId , req.body)
    return successResponse(res, 200 , "Updated course discount successfully" , result)
}

export const getCourseDiscounts = async (req: Request , res: Response , next: NextFunction) => {
    try {

        const filters = {
          scope: req.query.scope as "all" | "single" | undefined,
          type: req.query.type as "percent" | "fixed" | undefined,
          isActive:
            req.query.isActive !== undefined
              ? req.query.isActive === "true"
              : undefined,
          page: req.query.page ? parseInt(req.query.page as string) : undefined,
          limit: req.query.limit
            ? parseInt(req.query.limit as string)
            : undefined,
        };

        const result = await getCourseDiscountsService(filters);

        return successResponse(
          res,
          200,
          "Discounts fetched successfully",
          result
        );
        
    } catch (error) {
        next(error)
    }
}
