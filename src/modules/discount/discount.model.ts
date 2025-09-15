// models/CourseDiscount.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ICourseDiscount {
  scope: "all" | "single"; 
  course?: Types.ObjectId; 
  type: "percent" | "fixed";
  value: number;
  startAt?: Date;
  endAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseDiscountSchema = new Schema<ICourseDiscount>(
  {
    scope: { type: String, enum: ["all", "single"], required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true },
    startAt: Date,
    endAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CourseDiscountModel = model<ICourseDiscount>(
  "CourseDiscount",
  CourseDiscountSchema
);


export default CourseDiscountModel