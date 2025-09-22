import sessionModel, {ISession } from "./session.model";

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
    create: async (data: ICreateSession) : Promise<ISession> => await sessionModel.create(data)
}