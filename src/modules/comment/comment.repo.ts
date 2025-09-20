import { DeleteResult } from "mongoose";
import courseCommentModel, { ICourseComment } from "./comment.model";

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
    await courseCommentModel.findOne(condition),
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
};
