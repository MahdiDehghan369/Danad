import { RequestHandler, Response, NextFunction } from "express";
import { UserRole } from "../modules/user/user.model";
import { ICustomRequest } from "./auth";
import { AppError } from "../utils/appError";

export const checkRole = (roles: UserRole | UserRole[]): RequestHandler => {
  return (req: ICustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) return next(new AppError("User not authenticated", 401));

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(user.role)) {
      return next(new AppError("You can't access to this route", 403));
    }

    next();
  };
};
