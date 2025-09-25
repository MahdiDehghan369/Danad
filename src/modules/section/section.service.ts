import path from "path";
import { AppError } from "../../utils/appError";
import {
  ICreateSession,
  ISessionFilter,
  sessionRepo,
} from "../session/session.repo";
import { IEditSection, ISecionFilter, sectionRepo } from "./section.repo";
import { userRepo } from "../user/user.repo";
import { courseRepo } from "../course/course.repo";

export const createSessionService = async (
  files: { [fieldname: string]: Express.Multer.File[] },
  data: ICreateSession
) => {
  const section = await sectionRepo.findOne({ _id: data.section });
  if (!section) throw new AppError("Section not found", 404);

  const user = await userRepo.findById(data.createdBy);

  if (!user) throw new AppError("User not found", 404);

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

  if (section.course) {
    const course = await courseRepo.findOne({ _id: section.course });
    if (course) {
      course.duration += Number(data.videoDuration);
      await course.save();
    }
  }

  section.sessions.push(session._id);
  section.save();

  return { session };
};

export const getSessionsService = async (
  sectionId: string,
  filters: ISessionFilter
) => {
  const section = sectionRepo.findOne({ _id: sectionId });

  if (!section) throw new AppError("Section not found", 404);

  const sessions = await sessionRepo.findAllBySection(sectionId, filters);

  return sessions;
};

export const getSectionService = async (sectionId: string) => {
  const section = await sectionRepo.findOne({ _id: sectionId });

  if (!section) throw new AppError("Section not found", 404);

  const sessions = await Promise.all(
    section.sessions.map((sessionId) =>
      sessionRepo.findOne({ _id: sessionId, status: "published" })
    )
  );

  return {
    section: {
      ...(section.toObject?.() ?? section),
      sessions: sessions.filter((s) => s !== null),
    },
  };
};

export const changeStatusSectionService = async (
  sectionId: string,
  status: "draft" | "published"
) => {
  const section = await sectionRepo.findOne({ _id: sectionId });

  if (!section) throw new AppError("Section not found", 404);

  const updatedSection = await sectionRepo.findOneAndUpdate(
    { _id: sectionId },
    { status }
  );

  return { section: updatedSection };
};

export const editSectionService = async (
  sectionId: string,
  data: IEditSection
) => {
  const section = await sectionRepo.findOne({ _id: sectionId });

  if (!section) throw new AppError("Section not found", 404);

  const course = await courseRepo.findOne({ _id: data.course });

  if (!course) throw new AppError("Course not found", 404);

  const updatedSection = await sectionRepo.findOneAndUpdate(
    { _id: sectionId },
    data
  );

  return { section: updatedSection };
};

export const removeSectionService = async (sectionId: string) => {
  const section = await sectionRepo.findOne({ _id: sectionId });

  if (!section) throw new AppError("Section not found", 404);

  if (section.course) {
    const course = await courseRepo.findOne({ _id: section.course });

    if (course) {
      const sessions = await sessionRepo.findAll({ course: section.course });

      const totalDuration = sessions.reduce(
        (sum, session) => sum + (session.videoDuration || 0),
        0
      );

      course.duration -= totalDuration;
      await course.save();
    }
  }

  await sessionRepo.updateMany({ section: sectionId }, { section: null });

  await sectionRepo.deleteOne({ _id: sectionId });
};

export const addSessionToSectionService = async (
  sectionId: string,
  sessionId: string
) => {
  const section = await sectionRepo.findOne({ _id: sectionId });
  if (!section) throw new AppError("Section not found", 404);

  const session = await sessionRepo.findOne({ _id: sessionId });
  if (!session) throw new AppError("Session not found", 404);

  if (session.section?._id.toString() === sectionId.toString())
    throw new AppError("Session already belongs to this section", 409);

  section.sessions.push(session._id);
  session.section = section._id;

  if(section.course){
    
    const course = await courseRepo.findOne({ _id: section.course });

    if (course) {
      course.duration += session.videoDuration;
      await course.save();
    }
  }

  await Promise.all([section.save(), session.save()]);
};

export const removeSessionFromSectionService = async (
  sectionId: string,
  sessionId: string
) => {
  const section = await sectionRepo.findOne({ _id: sectionId });

  if (!section) throw new AppError("Section not found", 404);

  const session = await sessionRepo.findOne({ _id: sessionId });

  if (!session) throw new AppError("Session not found", 404);

  const sessionExistsInSection = section.sessions.some(
    (session) => session.toString() === sessionId.toString()
  );
  if (session.section._id.toString() === section._id.toString()) {
    await sessionRepo.updateOne({ _id: sessionId }, { section: null });
  }

  if (!sessionExistsInSection) {
    throw new AppError("Session not found in this section", 404);
  }

  section.sessions = section.sessions.filter(
    (session) => session.toString() !== sessionId.toString()
  );

    if (section.course) {
      const course = await courseRepo.findOne({ _id: section.course });

      if (course) {
        course.duration -= session.videoDuration;
        await course.save();
      }
    }

  await section.save();
};

export const getAllSectionForTeacherService = async (
  filters: ISecionFilter
) => {
  const sections = await sectionRepo.findAllSections(filters);

  return sections;
};
