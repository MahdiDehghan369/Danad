import { Schema, model, Document, Types } from "mongoose";

export interface IResource {
  name: string;
  url: string;
}

export interface ISession extends Document {
  course: Types.ObjectId;
  section: Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  videoDuration: number;
  fileUrl?: string;
  isFree: boolean;
  order: number;
  status: "draft" | "published";
  resources: IResource[];
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

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
    resources: [resourceSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const sessionModel = model<ISession>("Session", sessionSchema);

export default sessionModel
