import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { AppError } from "../utils/appError";

export const bodyValidator = (validator: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validator.validate(req.body);
      next();
    } catch (error : any) {
      throw new AppError(error.errors , 400)
    }
  };
};
