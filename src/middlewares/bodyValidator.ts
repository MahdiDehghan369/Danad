import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { AppError } from "../utils/appError";
import fs from "fs"
import path from "path";

export const bodyValidator = (validator: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validator.validate(req.body);
      next();
    } catch (error : any) {
        if (req.file?.fieldname === "cover") {
          fs.unlinkSync(
            path.join(
              __dirname,
              "..",
              "..",
              "public",
              "course-cover",
              req.file.filename
            )
          );
        } else if(req.file?.fieldname === "article-cover"){
           fs.unlinkSync(
             path.join(
               __dirname,
               "..",
               "..",
               "public",
               "article-cover",
               req.file.filename
             )
           );
        }
      throw new AppError(error.errors , 400)
    }
  };
};
