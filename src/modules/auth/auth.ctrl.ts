import { NextFunction, Request, Response } from "express";
import { registerService } from "./auth.service";
import { successResponse } from "../../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await registerService(req.body);
    return successResponse(res, 201, "User registered successfully :)", user);
  } catch (error) {
    next(error);
  }
};
