import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { addItemToCartService, applyCouponService, checkoutService, getCartService, removeCouponCartService, removeItemService } from "./cart.service";
import { successResponse } from "../../utils/response";

export const getCart = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const userId = req.user?._id as string


    const result = await getCartService(userId)

    return successResponse(res, 200 , "Get cart successfully", result)

  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const userId = req.user?._id as string

        const result = await addItemToCartService(userId , req.body.courseId)

        return successResponse(res, 200 , "Item added to cart successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const removeItem = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const result = await removeItemService(req.user?._id as string , req.params.itemId)

        return successResponse(res, 200 , "Removed successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const applyCoupon = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const userId = req.user?._id as string

    const result = await applyCouponService(userId , req.body.code)

    return successResponse(res, 200 , "Applied successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const removeCouponCart = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id as string;

    const result = await removeCouponCartService(userId);

    return successResponse(res, 200, "Coupon removed from cart successfully", result);
  } catch (error) {
    next(error);
  }
};

export const checkout = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const result = await checkoutService(req.user?._id as string)

    return successResponse(res, 200 , "Successfully" , result)
    
  } catch (error) {
    next(error)
  }
}