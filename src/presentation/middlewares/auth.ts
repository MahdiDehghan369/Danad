import {Request , Response , NextFunction} from "express"
import { userRepository } from "../../infrastructure/db/mongodb/repositories/userRepository"
import { verifyAccessToken } from "../../utils/jwt"
import { AppError } from "../../utils/appError"
import { ICustomRequest } from "../../application/interfaces/ICustomReq"


interface JWTPyload {
    _id: string
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
    const decoded = verifyAccessToken(token) as JWTPyload;

    const userRepo = new userRepository();

    const user = await userRepo.findById(decoded._id);

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    req.user = user.withoutPassword();
    next();
  } catch (error) {
    throw new AppError("Token invalid or expired", 422);
  }
};