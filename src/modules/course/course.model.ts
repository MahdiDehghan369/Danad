import mongoose, { Schema, model, Types, Document } from "mongoose";

export interface ICourse extends Document {
  _id: Types.ObjectId,  
  title: string;
  description: string;
  slug: string;
  price: number;
  cover: string;
  status: "completed" | "pending" | "draft";
  duration: number;
  category: Types.ObjectId;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  studentsEnrolled: number;
  teacher: Types.ObjectId;
  prerequisites: string[],
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: Number,
    cover: String,
    status: {
      type: String,
      enum: ["completed", "pending", "draft"],
      default: "draft",
    },
    duration: {
      type: Number,
      default: 0,
      min: 0
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    language: {
      type: String,
      default: "English",
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
      min:0
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    prerequisites: [String],
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "course",
  justOne: false,
});

courseSchema.index({ slug: 1, category: 1 });

courseSchema.methods.enrollStudent = function () {
  this.studentsEnrolled += 1;
  return this.save();
};

const courseModel = model<ICourse>("Course", courseSchema);

export default courseModel;
