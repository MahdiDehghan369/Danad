import { Schema, Types, model, Document } from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId;
  course: Types.ObjectId;
  price: number;
}

export interface ICart {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  discountAmount: number;
  coupon?: Types.ObjectId;
  finalTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  price: { type: Number, required: true, min: 0 },
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },

    subtotal: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    finalTotal: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const cartModel = model<ICart>("Cart", cartSchema);

export default cartModel;
