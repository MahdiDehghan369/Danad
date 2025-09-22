import { NextFunction, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { createSessionService } from "./section.service";
import { successResponse } from "../../utils/response";

export const createSession = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const data = req.body;
    data.section = req.params.sectionId;
    data.createdBy = req.user?._id as string;

    const result = await createSessionService(files, req.body);

    return successResponse(res, 200, " session created successfully", result);
  } catch (error) {
    next(error);
  }
};
