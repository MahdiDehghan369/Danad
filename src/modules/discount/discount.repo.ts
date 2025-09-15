import { DeleteResult, Types, UpdateResult } from "mongoose";
import courseDiscountModel from "./discount.model";

export interface ICreateDiscount {
  scope: "all" | "single";
  course?: Types.ObjectId;
  type: "percent" | "fixed";
  value: number;
  startAt?: Date;
  endAt?: Date;
  isActive: boolean;
}

export interface IUpdateDiscount {
  type?: "percent" | "fixed";
  value?: number;
  startAt?: Date;
  endAt?: Date;
  isActive?: boolean;
}

export const courseDiscountRepo = {
  create: async (data: ICreateDiscount): Promise<ICreateDiscount> =>
    await courseDiscountModel.create(data),
  findOne: async (condition: object): Promise<ICreateDiscount | null> =>
    await courseDiscountModel.findOne(condition).populate("course"),
  deleteOne: async (condition: object): Promise<DeleteResult> =>
    await courseDiscountModel.deleteOne(condition),
  findOneAndUpdate: async (
    condition: object,
    data: object
  ): Promise<ICreateDiscount | null> =>
    await courseDiscountModel.findOneAndUpdate(condition, data, { new: true }),
  find: async (
    filter: any,
    options: { skip?: number; limit?: number } = {}
  ) => {
    const discounts = await courseDiscountModel.find(filter)
      .populate("course") 
      .skip(options.skip || 0)
      .limit(options.limit || 10)
      .sort({ startAt: -1 });

    const total = await courseDiscountModel.countDocuments(filter);

    return { discounts, total };
  },
};
