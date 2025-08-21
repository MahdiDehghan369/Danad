import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { banUserService } from "./ban.service";
import { successResponse } from "../../utils/response";
import { IBanUserService } from "./ban.repo";

export const banUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: IBanUserService = {
      ...req.body,
      bannedBy: req.user?._id,
    };

    const result = await banUserService(data);

    return successResponse(res, 201, "User banned successfully :)", result);
  } catch (error) {
    next(error);
  }
};

