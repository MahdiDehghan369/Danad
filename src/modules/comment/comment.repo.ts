import mongoose, { DeleteResult, FilterQuery } from "mongoose";
import courseCommentModel, { ICourseComment } from "./comment.model";
import { AppError } from "../../utils/appError";

export interface ICreateComment {
  user: string;
  course: string;
  parentComment?: string;
  content: string;
  role: "user" | "student" | "admin" | "teacher";
}

export const commentRepo = {
  create: async (data: ICreateComment): Promise<ICourseComment> =>
    await courseCommentModel.create(data),
  findOne: async (condition: object): Promise<ICourseComment | null> =>
    await courseCommentModel
      .findOne(condition)
      .populate("user", "fullname username avatar")
      .populate("course", "-__v"),
  deleteOne: async (condition: object): Promise<DeleteResult> => {
    const comment = await courseCommentModel.findOne(condition);
    if (!comment) throw new Error("Comment not found");

    const allIdsToDelete: string[] = [comment._id.toString()];

    const replies = await courseCommentModel.find({
      parentComment: comment._id,
    });
    replies.forEach((r) => allIdsToDelete.push(r._id.toString()));

    const result = await courseCommentModel.deleteMany({
      _id: { $in: allIdsToDelete },
    });

    return result;
  },
  find: async (
    filter: FilterQuery<ICourseComment>,
    page: number,
    limit: number
  ) => {
    const skip = (page - 1) * limit;
    const comments = await courseCommentModel
      .find(filter)
      .populate("user", "name email")
      .populate("course", "title teacher")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await courseCommentModel.countDocuments(filter);

    return { comments, total, page, limit };
  },
  findTreeByCourse: async (courseId: string, status?: string) => {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const matchStage: any = {
      course: courseObjectId,
      parentComment: null,
    };

    if (status) {
      matchStage.status = status; // فقط وقتی status داده بشه اضافه میشه
    }

    const comments = await courseCommentModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: courseCommentModel.collection.name,
          localField: "_id",
          foreignField: "parentComment",
          as: "children",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          "user.password": 0,
          "user.role": 0,
          "user.createdAt": 0,
          "user.updatedAt": 0,
          "user.loginIPs": 0,
          "user.isEmailVerified": 0,
          "user.isPhoneVerified": 0,
          "user.__v": 0,
          "user.isBlocked": 0,
        },
      },
    ]);

    return comments;
  },
};
