import path from "path";
import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { categoryRepo } from "../category/category.repo";
import { userRepo } from "../user/user.repo";
import { courseRepo, ICourseFilter, ICreateCourseData } from "./course.repo";
import fs from "fs";
import { ICourse } from "./course.model";
import mongoose from "mongoose";
import { banRepo } from "../ban/ban.repo";
import { ICreateSection, sectionRepo } from "../section/section.repo";
import { sessionRepo } from "../session/session.repo";
import { courseDiscountRepo } from "../discount/discount.repo";
import { calcDiscountedPrice } from "../../utils/calcDiscountedPrice";
import { purchasedCourseRepo } from "../purchasedCourse/purchasedCourse.repo";
import { commentRepo } from "../comment/comment.repo";

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

  await sectionRepo.deleteMany({course: courseId})

  const sessions = await sessionRepo.findAll({course: courseId})

await Promise.all(
  sessions.map(async (session) => {
    if (session.fileUrl) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        session.fileUrl
      );
      try {
        await fs.promises.unlink(filePath).catch(() => {});
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          throw new AppError(`Error deleting file ${filePath}: ${err}`  , 500);
        }
      }
    }

    if (session.videoUrl) {
      const videoPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        session.videoUrl
      );
      try {
        await fs.promises.unlink(videoPath).catch(() => {});
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          throw new AppError(`Error deleting video ${videoPath}: ${err}`, 500);
        }
      }
    }

    await sessionRepo.deleteOne({ _id: session._id });
  })
);


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
  const sessions = await sessionRepo.findAll({
    course: courseId,
    status: "published",
  });

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

export const getAllSectionsOfCourseService = async (courseSlug: string) => {
  courseSlug = slugify(courseSlug);
  const course = await courseRepo.findBySlug(courseSlug);

  if (!course) throw new AppError("Course not found", 404);

  const sections = await sectionRepo.findAll({
    course: course._id.toString(),
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

export const getCourseService = async (courseSlug: string, userId?: string) => {
  courseSlug = slugify(courseSlug);
  const course = await courseRepo.findBySlug(courseSlug);

  if (!course) throw new AppError("Course not found", 404);

  const discounts = await courseDiscountRepo.find({ isActive: true });
  const now = new Date();

  const globalDiscount = discounts.discounts.find(
    (d) =>
      d.scope === "all" &&
      (!d.startAt || d.startAt <= now) &&
      (!d.endAt || d.endAt >= now)
  );

  const courseDiscount = discounts.discounts.find(
    (discount) =>
      discount.scope === "single" &&
      String(discount.course) === String(course._id) &&
      (!discount.startAt || discount.startAt <= now) &&
      (!discount.endAt || discount.endAt >= now)
  );

  const applied = courseDiscount || globalDiscount;
  const discountedPrice = calcDiscountedPrice(course.price, applied);

  const studentsEnrolled = await purchasedCourseRepo.find({
    course: course._id,
  });

  let userBoughtCourse = null

  if (userId) {
    const user = await userRepo.findById(userId);
    if(user){
      userBoughtCourse = await purchasedCourseRepo.findOne({user: userId , course: course._id})    
    }
  }

  const comments = await commentRepo.findTreeByCourse(
    course._id.toString(),
    "approved"
  );

  const newCourse = {
    _id: course._id,
    title: course.title,
    description: course.description,
    slug: course.slug,
    price: course.price,
    finalPrie: discountedPrice,
    disount: applied,
    cover: course.cover,
    category: course.category,
    language: course.language,
    studentsEnrolled: studentsEnrolled.length,
    teacher: course.teacher,
    prerequisites: course.prerequisites,
    userBoughtIt: Boolean(userBoughtCourse),
    rating: course.rating,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    comments
  };

  return { course: newCourse };
};

export const getCoursesService = async (filter: ICourseFilter) => {

  filter.condition = { status: { $ne: "draft" } };
  const courses = await courseRepo.findAllCourse(filter);

  return courses

}

export const getCoursesForAdminService = async (filter: ICourseFilter) => {

  const courses = await courseRepo.findAllCourse(filter)

  return courses

}