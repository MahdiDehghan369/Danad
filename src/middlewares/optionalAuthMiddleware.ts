import jwt from "jsonwebtoken";
import { userRepo } from "../modules/user/user.repo";
import { NextFunction, Response } from "express";
import { ICustomRequest, IJwt } from "./auth";
import { verifyAccessToken } from "../utils/jwt";

export const optionalAuthMiddleware = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      req.user = undefined;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      req.user = undefined;
      return next();
    }

    const decoded = verifyAccessToken(token) as IJwt;

    const user = await userRepo.findById(decoded.userId);
    if (!user) {
      req.user = undefined;
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    req.user = undefined;
    next();
  }
};
