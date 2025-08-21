import { AppError } from "../../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { refreshTokenRepo } from "../refreshToken/refresh.repo";
import { UserRole } from "../user/user.model";
import { authRepo } from "./auth.repo";
import { ICreateRefreshToken } from "./../refreshToken/refresh.repo";
import { env } from "../../config/env";

interface IRegisterUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

interface ILoginWithEmail {
  email: string;
  password: string;
}

export const registerService = async (data: Partial<IRegisterUser>) => {
  const usernameExists = await authRepo.findByUsername(data.username as string);

  if (usernameExists) throw new AppError("Username already exists", 409);

  const emailExists = await authRepo.findByEmail(data.email as string);

  if (emailExists) throw new AppError("Email already exists", 409);

  const phoneExists = await authRepo.findByPhone(data.phone as string);

  if (phoneExists) throw new AppError("Phone already exists", 409);

  const countUser = await authRepo.countuser();

  data.role = countUser > 0 ? "student" : "admin";

  const user = await authRepo.create(data);

  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
  };
};

export const loginWithEmailService = async (
  data: ILoginWithEmail,
  ip: string,
  userAgent: string
) => {
  const { email, password } = data;
  const user = await authRepo.findByEmail(email);
  if (!user) throw new AppError("Email or Password incorrect", 422);

  const matchPassword = await user.comparePassword(password);

  if (!matchPassword) throw new AppError("Email or Password incorrect", 422);

  const accessToken = generateAccessToken(user._id as string);
  const refreshToken = generateRefreshToken(user._id as string);

  const refreshTokenExists = await refreshTokenRepo.findByIpAndUserAgent(
    ip,
    userAgent
  );

  let refreshTokenInfoData: ICreateRefreshToken = {
    user: user._id as string,
    token: refreshToken,
    ip,
    userAgent,
    expireIn: new Date(
      Date.now() + Number(env.JWT.REFRESH_TOKEN_EXPIRE_IN) * 24 * 60 * 60 * 1000
    ),
  };

  if (refreshTokenExists) {
    refreshTokenExists.token = refreshToken;
    refreshTokenExists.expireIn = new Date(
      Date.now() + Number(env.JWT.REFRESH_TOKEN_EXPIRE_IN) * 24 * 60 * 60 * 1000
    );
    await refreshTokenExists.save();
  } else {
    await refreshTokenRepo.create(refreshTokenInfoData);
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
    },
  };
};

export const refreshTokenService = async (token : string) => {

  if(!token) throw new AppError("Refresh token missed" , 422)

  const refreshToken = await refreshTokenRepo.findOne({
    token,
    expireIn: { $gte: new Date() },
    isValid: true,
  });

  if (!refreshToken) throw new AppError("Refresh-Token not found :(", 404);

  const newRefreshToken = generateRefreshToken(refreshToken.user.toString());
  const accessToken = generateAccessToken(refreshToken.user.toString())

  const expireIn = new Date(
    Date.now() + Number(env.JWT.REFRESH_TOKEN_EXPIRE_IN) * 24 * 60 * 60 * 1000
  );

  const data = {
    expireIn,
    token : newRefreshToken
  }

  await refreshTokenRepo.updateOne(token , data)

  return {
    accessToken,
    refreshToken: newRefreshToken
  }

}

export const logoutService = async (token : string) => {
  if(!token) throw new AppError("Refresh token is missed :(" , 422)

  const refreshToken = await refreshTokenRepo.findOneByTokenAndDelete(token)

  if(!refreshToken) throw new AppError("Refresh token not found :)" , 404)
}
