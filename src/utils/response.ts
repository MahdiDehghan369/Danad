import { Response } from "express";

type BodyType = object | [] | string;

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  body?: BodyType
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    body,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
