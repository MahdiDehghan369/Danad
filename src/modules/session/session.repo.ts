import { DeleteResult } from "mongoose";
import sessionModel, { ISession } from "./session.model";

export interface ISessionFilter {
  status?: "draft" | "published";
  isFree?: boolean;
  page?: number;
  limit?: number;
  section?: string;
  course?: string;
}

export interface ICreateSession {
  course: string;
  section: string;
  title: string;
  description?: string;
  videoUrl: string | null;
  videoDuration: number;
  fileUrl: string | null;
  isFree: boolean;
  order: number;
  status: "draft" | "published";
  createdBy: string;
}

export const sessionRepo = {
  create: async (data: ICreateSession): Promise<ISession> =>
    await sessionModel.create(data),
  findAllBySection: async (sectionId: string, filter?: ISessionFilter) => {
    const query: ISessionFilter = { section: sectionId };

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.isFree) {
      query.isFree = filter.isFree;
    }

    const limit = filter?.limit && filter.limit > 0 ? filter.limit : 10;
    const page = filter?.page && filter.page > 0 ? filter.page : 1;

    const sessions = await sessionModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await sessionModel.countDocuments(query);

    return { sessions, total, page, limit };
  },
  findOne: async (condition: object): Promise<ISession | null> =>
    await sessionModel
      .findOne(condition)
      .populate("course", "-__v")
      .populate("section", "-__v")
      .populate("createdBy", "username fullname avatar"),
  deleteOne: async (condition: object): Promise<DeleteResult> =>
    await sessionModel.deleteOne(condition),
  findOneAndUpdate: async (condition: object, data: Partial<ISession>) =>
    await sessionModel.findOneAndUpdate(condition, data, { new: true }),
  findAll: async (condition: object): Promise<ISession[] | []> =>
    await sessionModel.find(condition).lean(),
  findAllSessions: async (filter?: ISessionFilter) => {
    const query: ISessionFilter = {};

    if (filter?.course) {
      query.course = filter.course;
    }

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.isFree) {
      query.isFree = filter.isFree;
    }

    const limit = filter?.limit && filter.limit > 0 ? filter.limit : 10;
    const page = filter?.page && filter.page > 0 ? filter.page : 1;

    const sessions = await sessionModel
      .find(query)
      .populate("course", "-__v")
      .populate("section", "-__v")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await sessionModel.countDocuments(query);

    return { sessions, total, page, limit };
  },
};
