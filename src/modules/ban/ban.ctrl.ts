import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import {
  banUserService,
  getBanInfoService,
  unbanUserService,
} from "./ban.service";
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

export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    await unbanUserService(userId);

    return successResponse(res, 200, "User unbanned successfully");
  } catch (error) {
    next(error);
  }
};

export const getBanInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const result = await getBanInfoService(userId);

    return successResponse(
      res,
      200,
      "Fetch ban user's info successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
