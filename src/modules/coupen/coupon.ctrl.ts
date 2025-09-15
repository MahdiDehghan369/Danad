import { NextFunction, Request, Response } from "express";
import {
  changeStatusCouponService,
  createCouponService,
  editCouponService,
  getCouponService,
  getCouponsService,
  removeCouponService,
} from "./coupon.service";
import { successResponse } from "../../utils/response";

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createCouponService(req.body);

    return successResponse(res, 200, "Coupon created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeCouponService(req.params.couponId);
    return successResponse(res, 200, "Coupon removed successfully");
  } catch (error) {
    next(error);
  }
};

export const changeStatusCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await changeStatusCouponService(req.params.couponId);

    return successResponse(res, 200, "Coupon updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCouponService(req.params.couponId);

    return successResponse(res, 200, "Get coupon info successfully", result);
  } catch (error) {
    next(error);
  }
};

export const editCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await editCouponService(req.params.couponId, req.body);

    return successResponse(res, 200, "Coupon updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = {
      type: req.query.type as "percent" | "fixed" | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const result = await getCouponsService(filters);

    return successResponse(res, 200, "Coupons fetched successfully", result);
  } catch (error) {
    next(error);
  }
};
