import { NextFunction, Request, Response } from "express";
import { changeStatusCourseService, changeTeacherCourseService, createCourseService, createSectionService, editCourseService, getAllSectionsOfCourseService, getAllSessionOfCourseServie, getCourseService, getCoursesForAdminService, getCoursesService, removeCourseCoverService, removeCourseService } from "./course.service";
import { successResponse } from "../../utils/response";
import fs from "fs";
import path from "path";
import { ICustomRequest } from "../../middlewares/auth";

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.cover = req.file?.filename;

    const result = await createCourseService(req.body);

    return successResponse(res, 200, "Course created successfully", result);
  } catch (error) {
    if (req.file?.filename) {
      fs.unlinkSync(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "course-cover",
          req.file?.filename
        )
      );
    }

    next(error);
  }
};

export const editCourse = async(req: Request , res: Response , next: NextFunction) => {
    try {

        console.log(req.body);

        req.body.cover = req.file?.filename;

        const result = await editCourseService(req.body , req.params.courseId);

        return successResponse(res, 200, "Course updated successfully", result);
        
    } catch (error) {
          if (req.file?.filename) {
            fs.unlinkSync(
              path.join(
                __dirname,
                "..",
                "..",
                "..",
                "public",
                "course-cover",
                req.file.filename
              )
            );
          }
          next(error);
        next(error)
    }
}

export const removeCourse = async (req: Request , res: Response , next: NextFunction) => {
  try {

    const {courseId} = req.params

    const result = await removeCourseService(courseId)

    return successResponse(res , 200 , "Course removed successfully")
    
  } catch (error) {
    next(error)
  }
}

export const changeStatusCourse = async (req: Request , res: Response , next: NextFunction) => {
  try {

    const {courseId} = req.params

    const result = await changeStatusCourseService(courseId , req.body.status)

    return successResponse(res, 200 , "Course's status changed successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const changeTeacherCourse = async (req: Request , res: Response , next: NextFunction) => {
  try {

    const {courseId} = req.params

    const result = await changeTeacherCourseService(courseId, req.body.teacher);

    return successResponse(
      res,
      200,
      "Course's teacher changed successfully",
      result
    );

    
  } catch (error) {
    next(error)
  }
}

export const removeCourseCover = async (req: Request , res: Response , next: NextFunction) => {
  try {

    const {courseId} = req.params

    await removeCourseCoverService(courseId)

    return successResponse(res, 200 , "Course's cover removed successfully")
    
  } catch (error) {
    next(error)
  }
}

export const createSection = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const userId= req.user?._id as string
    const courseId = req.params.courseId

    const data = req.body
    data.course = courseId
    data.createdBy = userId

    const result = await createSectionService(data)

    return successResponse(res, 200 , "Section created successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getAllSessionOfCourse = async (req: Request , res: Response , next: NextFunction) => {
  try {

    const courseId = req.params.courseId

    const result = await getAllSessionOfCourseServie(courseId)

    return successResponse(res, 200 , "Get all session of course successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getAllSectionsOfCourse = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const courseId = req.params.courseId

    const result = await getAllSectionsOfCourseService(courseId)

    return successResponse(res, 200, "Get all sections successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getCourse = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const courseSlug = req.params.courseSlug
    const userId = req.user?._id as string | undefined

    const result = await getCourseService(courseSlug , userId)

    return successResponse(res, 200 , "Get course successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getCourses = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const result = await getCoursesService(req.query)

    return successResponse(res, 200 , "Get all courses successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getCoursesForAdmin = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const result = await getCoursesForAdminService(req.query)

    return successResponse(res, 200 , "Get courses successfully" , result)
    
  } catch (error) {
    next(error)
  }
}