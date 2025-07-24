import { RegisterUser } from "../../../application/usecases/auth/registerUser";
import { LoginUserWithEmail } from "../../../application/usecases/auth/loginUser";
import { LogoutUser } from "../../../application/usecases/auth/logoutUser";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { RefreshTokenRepository } from "../../../infrastructure/db/mongodb/repositories/refreshTokenRepository";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../utils/appError";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepo = new userRepository();

    const existsUsername = await userRepo.findByUsername(req.body?.username);
    const existsEmail = await userRepo.findByEmail(req.body?.email);
    const existsPhone = await userRepo.findByPhone(req.body?.phone);

    const registerUsercase = new RegisterUser(userRepo);

    const user = await registerUsercase.execute(req.body);

    res.status(201).json({ message: "User registered", data: user });
  } catch (error) {
    next(error);
  }
};

export const loginUserWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repo = new userRepository();

    const loginUser = new LoginUserWithEmail(repo);
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const data = await loginUser.execute({
      email: req.body.email,
      password: req.body.password,
      ip: String(ip),
      userAgent: String(userAgent),
    });

    res.cookie("RefreshToken", data?.refreshToken, {
      httpOnly: true,
      maxAge: 1296000000,
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repo = new RefreshTokenRepository();

    const logoutUser = new LogoutUser(repo);

    const refreshToken = req.cookies?.RefreshToken;

    if (!refreshToken) throw new AppError("No refresh token provided", 400);

    const result = await logoutUser.execute({ refreshToken });

      res.clearCookie("RefreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
};
