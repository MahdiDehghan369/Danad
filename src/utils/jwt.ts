import jwt from "jsonwebtoken";
import { AppError } from "./appError";
import { env } from "../config/env";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT.ACCESS_TOKEN_SECRET_KEY as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT.REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT.ACCESS_TOKEN_SECRET_KEY as string);
  } catch (error) {
    throw new AppError("Invalid or expired access token", 401);
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT.REFRESH_TOKEN_SECRET_KEY as string);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};
