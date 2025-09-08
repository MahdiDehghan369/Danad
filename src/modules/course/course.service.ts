import path from "path";
import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { categoryRepo } from "../category/category.repo";
import { userRepo } from "../user/user.repo";
import { courseRepo, ICreateCourseData } from "./course.repo";
import fs from "fs"
import { ICourse } from "./course.model";
import mongoose from "mongoose";

export const createCourseService = async(data: ICreateCourseData) => {

    if(!data.cover) throw new AppError("No Cover Uploaded" , 422)

    data.slug = slugify(data.slug)
    const courseExists = await courseRepo.findOne({slug: data.slug})

    if(courseExists) throw new AppError("Course already exists with this slug" , 409)

    const teacher = await userRepo.findById(data.teacher.toString())

    if(!teacher || teacher.role !== "teacher") throw new AppError("Teacher not found" , 404)

    const category = await categoryRepo.findById(data.category.toString())

    if(!category || category.type !== "course" || category.status === "inactive") throw new AppError("Category not found" , 404)

    const coverPath = `/course-cover/${data.cover}`;

    data.cover = coverPath

    const newCourse = await courseRepo.create(data)

    return newCourse

}

export const editCourseService = async (data: ICreateCourseData , courseId: string) => {

    const course = await courseRepo.findOne({_id: courseId})
    
    if(!course) throw new AppError("Course not found" , 404)


    data.slug = slugify(data.slug);
    const courseExists = await courseRepo.findOne({ slug: data.slug });

    if (courseExists && courseExists._id.toString() !== courseId.toString())
      throw new AppError("Course already exists with this slug", 409);

    const teacher = await userRepo.findById(data.teacher.toString());

    if (!teacher || teacher.role !== "teacher")
      throw new AppError("Teacher not found", 404);

    const category = await categoryRepo.findById(data.category.toString());

    if (
      !category ||
      category.type !== "course" ||
      category.status === "inactive"
    )
      throw new AppError("Category not found", 404);

    if(data.cover && course.cover) {
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

  

    const editCourse = await courseRepo.findByIdAndUpdate(courseId , data);

    return editCourse as ICourse;
}