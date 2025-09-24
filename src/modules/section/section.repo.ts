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

export const sectionRepo = {
  create: async (data: ICreateSection): Promise<ISection> => await sectionModel.create(data),
  findOne: async (condition: object) : Promise<ISection | null> => await sectionModel.findOne(condition),
  findAll: async(condition: object) : Promise<ISection[] | []> => await sectionModel.find(condition).lean(),
  findOneAndUpdate: async (condition: object , data: object) : Promise<ISection | null> => await sectionModel.findOneAndUpdate(condition , data , {new: true}),
  deleteOne: async (condition: object) : Promise<DeleteResult> => await sectionModel.deleteOne(condition)
};
