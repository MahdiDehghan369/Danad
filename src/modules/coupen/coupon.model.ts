import { Schema, Types, model } from "mongoose";

export interface ICoupon {
  _id: Types.ObjectId,
  code: string; 
  type: "percent" | "fixed"; 
  value: number; 
  startAt?: Date; 
  endAt?: Date; 
  isActive: boolean; 
  usageLimit?: number; 
  usedCount: number; 
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
    },
    startAt: Date,
    endAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (): boolean {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.startAt && this.startAt > now) return false;
  if (this.endAt && this.endAt < now) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  return true;
};

const couponModel = model<ICoupon>("Coupon", couponSchema);

export default couponModel
