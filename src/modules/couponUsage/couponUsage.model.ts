import { Schema, model, Types } from "mongoose";

export interface ICouponUsage {
  user: Types.ObjectId;
  coupon: Types.ObjectId;
  appliedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    user: { type: Schema.ObjectId, ref: "User", required: true },
    coupon: { type: Schema.ObjectId, ref: "Coupon", required: true },
    appliedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

couponUsageSchema.index({ user: 1, coupon: 1 }, { unique: true });

const couponUsageModel = model<ICouponUsage>(
  "CouponUsage",
  couponUsageSchema
);

export default couponUsageModel
