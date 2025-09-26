// middlewares/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { errorResponse } from "../utils/response";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message);
  }

  return errorResponse(res, 500, err);
};
