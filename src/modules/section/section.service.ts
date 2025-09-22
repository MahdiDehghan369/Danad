import path from "path";
import { AppError } from "../../utils/appError";
import { ICreateSession, sessionRepo } from "../session/session.repo";
import { sectionRepo } from "./section.repo";
import { userRepo } from "../user/user.repo";

export const createSessionService = async (
  files: { [fieldname: string]: Express.Multer.File[] },
  data: ICreateSession
) => {
  const section = await sectionRepo.findOne({ _id: data.section });
  if (!section) throw new AppError("Section not found", 404);

  const user = await userRepo.findById(data.createdBy)

  if(!user) throw new AppError("User not found" , 404)

  const videoFile = files?.["session-video"]?.[0] ?? null;
  const archiveFile = files?.["session-file"]?.[0] ?? null;

  const videoUrl = videoFile?.filename ? videoFile.filename : null;
  const archiveFileUrl = archiveFile?.filename ? archiveFile.filename : null;


  const session = await sessionRepo.create({
    ...data,
    course: section.course.toString(),
    videoUrl: videoUrl ? `/session-video/${videoUrl}` : null,
    fileUrl: videoUrl ? `/session-file/${archiveFileUrl}` : null,
  });

  return {session}

};
