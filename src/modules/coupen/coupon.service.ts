import { AppError } from "../../utils/appError";
import { couponRepo, ICreateCoupon } from "./coupon.repo";

interface IEditCoupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  startAt: Date;
  endAt: Date;
  usageLimit: number;
  isActive: boolean;
}

interface IGetCoupons {
  type?: "percent" | "fixed";
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const createCouponService = async (data: ICreateCoupon) => {
    
    const couponExists = await couponRepo.findOne({code: data.code})

    if(couponExists) throw new AppError("Coupon code already exists", 422);

    const coupon = await couponRepo.create(data)

    return coupon

}

export const removeCouponService = async (couponId: string) => {
    
    const coupon = await couponRepo.findOne({_id: couponId})

    if(!coupon) throw new AppError("Coupon not found" , 404)
        
    await couponRepo.deleteOne({_id: couponId})

}

export const changeStatusCouponService = async (couponId: string) => {

    const coupon = await couponRepo.findOne({_id: couponId})

    if(!coupon) throw new AppError("Coupon not found" , 404)

    const isActive = !coupon.isActive

    const updatedCoupon = await couponRepo.findOneAndUpdate({_id: couponId} , {isActive})

    return {coupon : updatedCoupon}

}

export const getCouponService = async (couponId: string) => {

    const coupon = await couponRepo.findOne({_id: couponId})

    if(!coupon) throw new AppError("Coupon not found" , 404)

    return {coupon}

}

export const editCouponService = async (couponId: string , data: IEditCoupon) => {
    const coupon = await couponRepo.findOne({_id: couponId})

    if(!coupon) throw new AppError("Coupon not found" , 404)

    const couponExists = await couponRepo.findOne({code: data.code})

    if(couponExists && couponExists?._id.toString() !== coupon._id.toString()) throw new AppError("Coupon code already exists" , 409)

    const updatedCoupon = await couponRepo.findOneAndUpdate({_id: couponId} , data)

    return {coupon: updatedCoupon}
}

export const getCouponsService = async (filters: IGetCoupons) => {
  const { page = 1, limit = 10, ...restFilters } = filters;

  const mongoFilter: any = {};
  if (restFilters.type) mongoFilter.type = restFilters.type;
  if (restFilters.isActive !== undefined)
    mongoFilter.isActive = restFilters.isActive;

  const skip = (page - 1) * limit;

  const { discounts, total } = await couponRepo.find(mongoFilter, {
    skip,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    discounts,
    page,
    limit,
    total,
    totalPages,
  };
};