import path from "path";
import { AppError } from "../../utils/appError";
import { banRepo } from "../ban/ban.repo";
import { IUser, UserRole } from "./user.model";
import { IEditUserInfo, IGetUsersQuery, userRepo } from "./user.repo";
import bcrypt from "bcrypt";
import fs from "fs";
import { refreshTokenRepo } from "../refreshToken/refresh.repo";

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const matchPassword = await user.comparePassword(currentPassword);

  if (!matchPassword) throw new AppError("Password is wrong", 422);

  if (await user.comparePassword(newPassword)) {
    throw new AppError("New password cannot be the same as old password", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await userRepo.updateUserById(userId, { password: hashedPassword });
};

export const editUserInfoService = async (
  userId: string,
  data: IEditUserInfo
) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const isEmailExists = await userRepo.findByEmail(data.email);

  if (isEmailExists?._id != userId.toString())
    throw new AppError("Email already exists", 409);

  const isUsernameExists = await userRepo.findByUsername(data.username);
  if (isUsernameExists?._id != userId.toString())
    throw new AppError("Username already exists", 409);

  const result = (await userRepo.updateUserById(userId, data)) as IUser;

  return result;
};

export const removeUserService = async (userId: string) => {
  const user = await userRepo.findOneAndDelete({ _id: userId });

  if (!user) throw new AppError("User not found :(", 404);

  await banRepo.removeUser(userId);

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
  };
};

export const getUserInfoService = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  user.password = "";

  return user;
};

export const changeUserRoleService = async (userId: string, role: UserRole) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  if (user.role === role) throw new AppError("The user has this role", 409);

  await userRepo.findOneAndUpdate({ _id: userId }, { role });
};

export const getUsersService = async (query: IGetUsersQuery) => {
  const users = await userRepo.find(query);
  return users;
};

export const setProfileService = async (
  userId: string,
  filename: string | undefined
) => {
  if (!filename) throw new AppError("Upload file is required", 422);
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  if (user.avatar) {
    const oldPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      user.avatar
    );
    try {
      await fs.promises.unlink(oldPath);
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        throw new AppError("Error removing old profile", 500);
      }
    }
  }

  const profilePath = `/profile/${filename}`;

  const updatedUser = (await userRepo.updateUserById(userId, {
    avatar: profilePath,
  })) as IUser;

  updatedUser.password = "";

  return updatedUser;
};

export const removeProfileService = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  if (!user.avatar) {
    throw new AppError("User does not have a profile photo", 400);
  }
  const profilePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    user.avatar
  );

  try {
    await fs.promises.unlink(profilePath);
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }

  user.avatar = "";

  await user.save();
};

export const getActiveAccountsService = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const activeAccounts = await refreshTokenRepo.find({
    user: userId,
    expireIn: { $gt: new Date() },
  });

  return activeAccounts;
};

export const removeAccountService = async (
  userId: string,
  accountId: string
) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);
  const account = await refreshTokenRepo.findById(accountId);
  if (!account) throw new AppError("Account not found", 404);

  if (String(account.user) !== String(userId)) {
    throw new AppError("You are not allowed to remove this account", 403);
  }

  await refreshTokenRepo.removeById(accountId);
};

export const removeAllAccountsService = async (userId: string) => {
  const user = await userRepo.findById(userId)

  if(!user) throw new AppError("User not found" , 404)

  const accounts = await refreshTokenRepo.find({
    user: userId,
    expireIn: { $gt: new Date() },
  });

  if(accounts.length === 0) throw new AppError("You don't have any account" , 400)

  await Promise.all(
    accounts.map((acc) => refreshTokenRepo.removeById(String(acc._id)))
  );
}
