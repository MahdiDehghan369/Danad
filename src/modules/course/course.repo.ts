import { Types } from "mongoose";
import courseModel, { ICourse } from "./course.model";

export interface ICreateCourseData {
  title: string;
  description: string;
  slug: string;
  price: number;
  cover: string;
  status: "completed" | "pending" | "draft";
  category: Types.ObjectId;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  teacher: Types.ObjectId;
  prerequisites: string[]
}

export const courseRepo = {
  create: async (data: ICreateCourseData): Promise<ICourse> =>
    await courseModel.create(data),
  findOne: async (condition: object): Promise<ICourse | null> =>
    await courseModel.findOne(condition),
  findByIdAndUpdate: async (courseId: string, data: object) : Promise<ICourse | null> =>
    await courseModel.findByIdAndUpdate(courseId, data , {new: true}),
};