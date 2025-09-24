import path from "path";
import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { categoryRepo } from "../category/category.repo";
import { userRepo } from "../user/user.repo";
import { courseRepo, ICreateCourseData } from "./course.repo";
import fs from "fs";
import { ICourse } from "./course.model";
import mongoose from "mongoose";
import { banRepo } from "../ban/ban.repo";
import { ICreateSection, sectionRepo } from "../section/section.repo";
import { sessionRepo } from "../session/session.repo";

type statusCourse = "completed" | "pending" | "draft";

export const createCourseService = async (data: ICreateCourseData) => {
  if (!data.cover) throw new AppError("No Cover Uploaded", 422);

  data.slug = slugify(data.slug);
  const courseExists = await courseRepo.findOne({ slug: data.slug });

  if (courseExists)
    throw new AppError("Course already exists with this slug", 409);

  const teacher = await userRepo.findById(data.teacher.toString());

  if (!teacher || teacher.role !== "teacher")
    throw new AppError("Teacher not found", 404);

  const category = await categoryRepo.findById(data.category.toString());

  if (!category || category.type !== "course" || category.status === "inactive")
    throw new AppError("Category not found", 404);

  const coverPath = `/course-cover/${data.cover}`;

  data.cover = coverPath;

  const newCourse = await courseRepo.create(data);

  return newCourse;
};

export const editCourseService = async (
  data: ICreateCourseData,
  courseId: string
) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  data.slug = slugify(data.slug);
  const courseExists = await courseRepo.findOne({ slug: data.slug });

  if (courseExists && courseExists._id.toString() !== courseId.toString())
    throw new AppError("Course already exists with this slug", 409);

  const teacher = await userRepo.findById(data.teacher.toString());

  if (!teacher || teacher.role !== "teacher")
    throw new AppError("Teacher not found", 404);

  const category = await categoryRepo.findById(data.category.toString());

  if (!category || category.type !== "course" || category.status === "inactive")
    throw new AppError("Category not found", 404);

  if (data.cover && course.cover) {
    const oldCoverPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      course.cover.replace(/^\/+/, "")
    );
    if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
    const coverPath = `/course-cover/${data.cover}`;
    data.cover = coverPath;
  }

  const editCourse = await courseRepo.findByIdAndUpdate(courseId, data);

  return editCourse as ICourse;
};

export const removeCourseService = async (courseId: string) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  if (course.cover) {
    const coverPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      course.cover.replace(/^\/+/, "")
    );

    if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
  }

  await courseRepo.deleteOne({ _id: courseId });
};

export const changeStatusCourseService = async (
  courseId: string,
  status: statusCourse
) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  const updatedCourse = await courseRepo.findByIdAndUpdate(courseId, {
    status,
  });

  return updatedCourse as ICourse;
};

export const changeTeacherCourseService = async (
  courseId: string,
  teacher: string
) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  const teacherExists = await userRepo.findById(teacher);

  if (!teacherExists || teacherExists.role !== "teacher")
    throw new AppError("Teacher not found", 404);

  const teacherBan = await banRepo.getBanInfo(teacher);

  if (teacherBan) throw new AppError("Teacher already banned", 400);

  const updatedCourse = await courseRepo.findByIdAndUpdate(courseId, {
    teacher,
  });

  return updatedCourse as ICourse;
};

export const removeCourseCoverService = async (courseId: string) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  if (!course.cover)
    throw new AppError("Course don't have cover to remove", 404);

  const coverPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    course.cover.replace(/^\/+/, "")
  );

  try {
    if (fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
    }
  } catch (err) {
    throw new AppError("Failed to remove course cover from disk", 500);
  }

  await courseRepo.findByIdAndUpdate(courseId, { cover: null });
};

export const createSectionService = async (data: ICreateSection) => {
  const course = await courseRepo.findOne({ _id: data.course });

  if (!course) throw new AppError("Course not found", 404);

  const user = await userRepo.findById(data.createdBy);

  if (!user) throw new AppError("User not found", 404);

  const section = await sectionRepo.create(data);

  return { section };
};

export const getAllSessionOfCourseServie = async (courseId: string) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  const sections = await sectionRepo.findAll({
    course: courseId,
    status: "published",
  });
  const sessions = await sessionRepo.findAll({course: courseId , status: "published"});

  const result = sections.map((section: any) => {
    const sectionSessions = sessions
      .filter((s: any) => s.section.toString() === section._id.toString())
      .sort((a: any, b: any) => a.order - b.order);

    return {
      ...section,
      sessions: sectionSessions,
    };
  });

  return result;
};

export const getAllSectionsOfCourseService = async (courseId: string) => {
  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  const sections = await sectionRepo.findAll({
    course: courseId,
    status: "published",
  });

  const newSections = await Promise.all(
    sections.map(async (section) => {
      const sessions = await Promise.all(
        section.sessions.map((sessionId) =>
          sessionRepo.findOne({ _id: sessionId, status: "published" })
        )
      );

      return {
        ...(section.toObject?.() ?? section), 
        sessions: sessions.filter((s) => s !== null),
      };
    })
  );

  return { sections: newSections };
};