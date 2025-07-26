import { Request, Response, NextFunction } from "express";
import { ICustomRequest } from "../../application/interfaces/ICustomReq";

export const isAdminMiddleware = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (user?.role != "ADMIN")
      return res.status(403).json({
        success: false,
        message: "Access denied: You must be admin",
      });

    next();
  } catch (error) {
    next(error);
  }
};
