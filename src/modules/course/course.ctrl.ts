import { NextFunction, Request, Response } from "express";
import { changeStatusCourseService, createCourseService, editCourseService, removeCourseService } from "./course.service";
import { successResponse } from "../../utils/response";
import fs from "fs";
import path from "path";

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