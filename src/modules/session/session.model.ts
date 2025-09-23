import { Schema, model, Document, Types } from "mongoose";



export interface ISession extends Document {
  _id: Types.ObjectId,
  course: Types.ObjectId;
  section: Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string| null;
  videoDuration: number;
  fileUrl: string | null;
  isFree: boolean;
  order: number;
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}



const sessionSchema = new Schema<ISession>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
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
    videoUrl: {
      type: String,
      required: true,
    },
    videoDuration: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const sessionModel = model<ISession>("Session", sessionSchema);

export default sessionModel
