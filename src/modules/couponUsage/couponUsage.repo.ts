import couponUsageModel, { ICouponUsage } from "./couponUsage.model"

interface ICreateCouponUsage {
    user: string,
    coupon: string
}

export const couponUsageRepo = {
    create: async(data: ICreateCouponUsage) : Promise<ICouponUsage> => await couponUsageModel.create(data),
    findOne: async(condition: object) : Promise<ICouponUsage | null> => await couponUsageModel.findOne(condition)
}