import { Types } from "mongoose";
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

export const courseDiscountRepo = {
  create: async (data: ICreateDiscount) =>
    await courseDiscountModel.create(data),
  findOne: async(condition: object) => await courseDiscountModel.findOne(condition)
};
