import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICourseComment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  course: Types.ObjectId;
  parentComment?: Types.ObjectId;
  content: string;
  likes: number;
  dislikes: number;
  likesUsers: Types.ObjectId[];
  dislikesUsers: Types.ObjectId[],
  status: "pending" | "approved" | "rejected";
  role: "user" | "student" | "admin" | "teacher";
  createdAt: Date;
  updatedAt: Date;
}

const CourseCommentSchema: Schema<ICourseComment> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "CourseComment",
      default: null,
    },
    content: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likesUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikesUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["user", "student", "admin", "teacher"],
      required: true,
    },
  },
  { timestamps: true }
);

const courseCommentModel = mongoose.model<ICourseComment>(
  "CourseComment",
  CourseCommentSchema
);

export default courseCommentModel 
