import { Schema, model, Document, Types } from "mongoose";

export interface ISection extends Document {
  course: Types.ObjectId; 
  title: string; 
  description?: string;
  order: number; 
  sessions: Types.ObjectId[];
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
    },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const sectionModel = model<ISection>("Section", sectionSchema);

export default sectionModel
