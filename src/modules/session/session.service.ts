import path from "path";
import fs from "fs";
import { AppError } from "../../utils/appError";
import { purchasedCourseRepo } from "../purchasedCourse/purchasedCourse.repo";
import { userRepo } from "../user/user.repo";
import { ISessionFilter, sessionRepo } from "./session.repo";
import { sectionRepo } from "../section/section.repo";
import { courseRepo } from "../course/course.repo";

export const getSessionService = async (sessionId: string) => {
  const session = await sessionRepo.findOne({ _id: sessionId });

  if (!session) throw new AppError("Session not found", 404);

  return { session };
};

export const removeSessionService = async (sessionId: string) => {
  const session = await sessionRepo.findOne({ _id: sessionId });

  if (!session) throw new AppError("Session not found", 404);

  if (session.fileUrl) {
    const filePath = path.join(__dirname , "..", "..", "..", "public", session.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  if (session.videoUrl) {
    const videoPath = path.join(__dirname , "..", "..", "..", "public", session.videoUrl);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
  }

  const section = await sectionRepo.findOne({ _id: session.section });

  if (section?.sessions) {
    section.sessions = section.sessions.filter(
      (sessionId) => sessionId.toString() !== session._id.toString()
    );
    await section.save();
  }

    if(session.course){
      
      const course = await courseRepo.findOne({ _id: session.course });
  
      if (course) {
        course.duration -= session.videoDuration;
        await course.save();
      }
    }

  await sessionRepo.deleteOne({ _id: sessionId });
};

export const changeStatusSessionService = async (
  sessionId: string,
  status: "draft" | "published"
) => {
  const session = sessionRepo.findOne({ _id: sessionId });

  if (!session) throw new AppError("Session not found", 404);

  const updatedSession = await sessionRepo.findOneAndUpdate(
    { _id: sessionId },
    { status }
  );

  return { session: updatedSession };
};

export const changeFreeSessionService = async (
  sessionId: string,
  isFree: boolean
) => {
  const session = await sessionRepo.findOne({ _id: sessionId });

  if (!session) throw new AppError("Session not found", 404);

  const updatedSession = await sessionRepo.findOneAndUpdate(
    { _id: sessionId },
    { isFree }
  );

  return { session: updatedSession };
};

export const watchSessionService = async (
  sessionId: string,
  userId: string
) => {
  const session = await sessionRepo.findOne({ _id: sessionId });

  if (!session) throw new AppError("Session not found", 404);

  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  if (!session.isFree) {
    const userBoughtCourse = await purchasedCourseRepo.findOne({
      course: session.course,
      user: userId,
    });

    if (!userBoughtCourse) {
      throw new AppError("You don't have access to watch this session", 403);
    }
  }

  return { session };
};

export const getAllSessionsService = async (filters: ISessionFilter) => {
  const sessions = await sessionRepo.findAllSessions(filters);

  return sessions;
};
