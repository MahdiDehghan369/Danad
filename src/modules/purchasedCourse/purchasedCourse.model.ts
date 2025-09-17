import { Schema, model, Types, Document, Model } from "mongoose";

export interface IPurchasedCourse {
  user: Types.ObjectId;
  course: Types.ObjectId;
  basePrice: number; 
  priceAtPurchase: number;
  discountAmount: number; 
  coupon?: Types.ObjectId | null;
  payment: {
    gateway?: string;
    transactionId?: string;
  };
  status: "paid" | "pending" | "failed" | "refunded";
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const purchasedCourseSchema = new Schema<IPurchasedCourse>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    coupon: {
      type: Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    payment: {
      gateway: { type: String },
      transactionId: { type: String },
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "paid",
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

purchasedCourseSchema.index({ user: 1, course: 1 }, { unique: true });

const purchasedCourseModel = model<IPurchasedCourse>("PurchasedCourse", purchasedCourseSchema);


export default purchasedCourseModel 