import { Document, Schema, model, Types } from "mongoose";
import { slugify } from "../../utils/slugify";

export type ArticleStatus = "draft" | "published";

export interface IArticle extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  cover: string;
  author: Types.ObjectId;
  relatedCourses?: string[];
  category: Types.ObjectId;
  status: ArticleStatus;
  views: number;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    relatedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);


ArticleSchema.index({ slug: 1 });

const articleModel = model<IArticle>("Article", ArticleSchema);

export default articleModel;
