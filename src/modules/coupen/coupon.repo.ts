import { DeleteResult } from "mongoose";
import couponModel, { ICoupon } from "./coupon.model";

export interface ICreateCoupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  startAt: Date;
  endAt: Date;
  isActive?: boolean;
}

export const couponRepo = {
  create: async (data: ICreateCoupon): Promise<ICoupon> => await couponModel.create(data),
  findOne: async (condition: object): Promise<ICoupon | null> => await couponModel.findOne(condition),
  deleteOne: async (condition: object) : Promise<DeleteResult> => await couponModel.deleteOne(condition),
  findOneAndUpdate: async (condition: object , data: object) : Promise<ICoupon| null> => await couponModel.findOneAndUpdate(condition , data , {new: true}),
  find: async (
      filter: any,
      options: { skip?: number; limit?: number } = {}
    ) => {
      const discounts = await couponModel.find(filter)
        .skip(options.skip || 0)
        .limit(options.limit || 10)
        .sort({ startAt: -1 });
  
      const total = await couponModel.countDocuments(filter);
  
      return { discounts, total };
    },
};