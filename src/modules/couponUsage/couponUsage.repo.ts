import couponUsageModel, { ICouponUsage } from "./couponUsage.model"

interface ICreateCouponUsage {
    user: string,
    coupon: string
}

export interface IQueryGetCoupons {
    page?: number,
    limit?: number
}

export const couponUsageRepo = {
    create: async(data: ICreateCouponUsage) : Promise<ICouponUsage> => await couponUsageModel.create(data),
    findOne: async(condition: object) : Promise<ICouponUsage | null> => await couponUsageModel.findOne(condition),
    find: async(user: string , query: IQueryGetCoupons) => {
        const {page = 1 , limit = 10} = query

        const coupons = await couponUsageModel
          .find({ user }).populate("coupon", "-__v")
          .sort({ appliedAt : -1})
          .skip((page - 1) * limit)
          .limit(limit);


        const total = await couponUsageModel.countDocuments({user});

        return {coupons , total , page , limit}
    }
}