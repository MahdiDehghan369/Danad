import { DeleteResult } from "mongoose";
import sectionModel, { ISection } from "./section.model";

export interface ICreateSection {
  course: string;
  title: string;
  description?: string;
  order: number;
  status: "draft" | "published";
  createdBy: string;
}

export interface IEditSection {
  course: string;
  title: string;
  description?: string;
  order: number;
  status: "draft" | "published";
}

export interface ISecionFilter {
  course?: string,
  status?: "draft" | "published"
  page?: number,
  limit?: number
}

export const sectionRepo = {
  create: async (data: ICreateSection): Promise<ISection> =>
    await sectionModel.create(data),
  findOne: async (condition: object): Promise<ISection | null> =>
    await sectionModel.findOne(condition),
  findAll: async (condition: object): Promise<ISection[] | []> =>
    await sectionModel.find(condition).lean(),
  findOneAndUpdate: async (
    condition: object,
    data: object
  ): Promise<ISection | null> =>
    await sectionModel.findOneAndUpdate(condition, data, { new: true }),
  deleteOne: async (condition: object): Promise<DeleteResult> =>
    await sectionModel.deleteOne(condition),
  findAllSections: async (filter: ISecionFilter) => {
    const query: ISecionFilter = {};

    if (filter?.course) {
      query.course = filter.course;
    }

    if (filter?.status) {
      query.status = filter.status;
    }


    const limit = filter?.limit && filter.limit > 0 ? filter.limit : 10;
    const page = filter?.page && filter.page > 0 ? filter.page : 1;

    const sessions = await sectionModel
      .find(query)
      .populate("course", "-__v")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await sectionModel.countDocuments(query);

    return { sessions, total, page, limit };
  },
  deleteMany : async(condition: object) => await sectionModel.deleteMany(condition)
};
