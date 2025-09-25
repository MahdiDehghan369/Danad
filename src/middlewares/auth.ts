import { NextFunction, Request, Response } from "express";
import { IUser } from "../modules/user/user.model";
import { verifyAccessToken } from "../utils/jwt";
import { userRepo } from "../modules/user/user.repo";
import { AppError } from "../utils/appError";

export interface ICustomRequest extends Request {
    user?: IUser
}

export interface IJwt {
    userId: string
}

export const authMiddleware = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  const existsAuthorization = req?.headers?.authorization;

  if (!existsAuthorization || !existsAuthorization.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: "Access token missed or malformed",
    });
  }

  const token = existsAuthorization.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token) as IJwt;

    const user = await userRepo.findById(decoded.userId)

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    user.password = ""
    req.user = user


    next();

  } catch (error) {
    console.log(error);
    throw new AppError("Token invalid or expired", 422);
  }
};