import { DeleteResult, Types } from "mongoose";
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
  prerequisites: string[];
}

export interface ICourseFilter {
  search?: string;
  isFree?: boolean;
  isPreSale?: boolean;
  categories?: string[];
  sortBy?: "cheapest" | "expensive" | "popular" | "all";
  page?: number;
  limit?: number;
  condition?: object;
  status?: "completed" | "pending" | "draft";
}



export const courseRepo = {
  create: async (data: ICreateCourseData): Promise<ICourse> =>
    await courseModel.create(data),
  findAllCourse: async (filter: ICourseFilter = {}) => {
    const query: any = {};

        if (filter.search) {
          query.$or = [
            { title: { $regex: filter.search, $options: "i" } },
            { description: { $regex: filter.search, $options: "i" } },
            { slug: { $regex: filter.search, $options: "i" } },
          ];
        }

    if (filter.isFree) query.price = 0;
    if (filter.isPreSale) query.status = "pending";
    if (filter.categories && filter.categories.length > 0)
      query.category = { $in: filter.categories };

    if (filter.status) query.status = filter.status;

    if (filter.condition) {
      Object.assign(query, filter.condition);
    }

    const sortOptions: Record<string, any> = {
      cheapest: { price: 1 },
      expensive: { price: -1 },
      popular: { studentsCount: -1 },
      all: { createdAt: -1 },
    };
    const sort = sortOptions[filter.sortBy || "all"];

    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      courseModel.find(query).sort(sort).skip(skip).limit(limit),
      courseModel.countDocuments(query),
    ]);

    return {
      courses: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  findOne: async (condition: object): Promise<ICourse | null> =>
    await courseModel.findOne(condition),
  findByIdAndUpdate: async (
    courseId: string,
    data: object
  ): Promise<ICourse | null> =>
    await courseModel.findByIdAndUpdate(courseId, data, { new: true }),
  deleteOne: async (condition: object): Promise<DeleteResult> =>
    await courseModel.deleteOne(condition),
  findBySlug: async (courseSlug: string): Promise<ICourse | null> =>
    await courseModel
      .findOne({ slug: courseSlug })
      .populate("teacher", "fullname avatar username email")
      .populate("category", "title slug description"),
  find: async (condition: object): Promise<ICourse[] | []> =>
    await courseModel.find(condition),
};
