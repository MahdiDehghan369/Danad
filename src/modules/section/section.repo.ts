import sectionModel, { ISection } from "./section.model";

export interface ICreateSection {
  course: string;
  title: string;
  description?: string;
  order: number;
  status: "draft" | "published";
  createdBy: string;
}

export const sectionRepo = {
  create: async (data: ICreateSection): Promise<ISection> => await sectionModel.create(data),
};
