import { Types, UpdateResult } from "mongoose";
import cartModel from "./cart.model";

export const cartRepo = {
  findOrCreate: async (user: string) => {
    const cart = await cartModel.findOne({ user }).populate("items.course");

    if (cart) return cart;

    const newCart = await cartModel.create({
      user,
      subtotal: 0,
      discountAmount: 0,
      finalTotal: 0,
    });

    return newCart;
  },
  updateOne: async (condition: object , data: object) : Promise<UpdateResult> => {
    return await cartModel.updateOne(condition , data)
  }
};
