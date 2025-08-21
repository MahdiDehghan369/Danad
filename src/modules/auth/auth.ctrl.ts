import { NextFunction, Request, Response } from "express";
import {
  registerService,
  loginWithEmailService,
  refreshTokenService,
  logoutService,
} from "./auth.service";
import { successResponse } from "../../utils/response";
import { env } from "../../config/env";

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

export const loginWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "";
    const userAgent = req.headers["user-agent"] || "unknown";

    const result = await loginWithEmailService(req.body, ip, userAgent);

    res.cookie("RefreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Number(env.JWT.REFRESH_TOKEN_EXPIRE_IN) * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 201, "User logged in successfully :)", result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.RefreshToken;

    const result = await refreshTokenService(refreshToken);
    res.cookie("RefreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Number(env.JWT.REFRESH_TOKEN_EXPIRE_IN) * 24 * 60 * 60 * 1000,
    });

    return successResponse(
      res,
      200,
      "Refresh token updated successfully :)",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.RefreshToken;

    await logoutService(refreshToken);

    res.clearCookie("RefreshToken", {
      httpOnly: true,
      secure: true,
    });

    return successResponse(res, 200, "Logout successfully :)");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request , res: Response , next: NextFunction) => {
  try {
    
  } catch (error) {
    next(error)
  }
}