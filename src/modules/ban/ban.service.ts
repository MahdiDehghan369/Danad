import { AppError } from "../../utils/appError";
import { userRepo } from "../user/user.repo";
import { banUser } from "./ban.ctrl";
import { banRepo, IBanUserService } from "./ban.repo";

export const banUserService = async (data: IBanUserService) => {
  if (data.user == data.bannedBy)
    throw new AppError("You can't banned yourself", 400);

  const user = await userRepo.findById(data.user);
  if (!user) throw new AppError("User not found :(", 404);

  const alreadyBanned = await banRepo.banActive(data.user);
  if (alreadyBanned) throw new AppError("User already banned :)", 409);

  if (data.endAt && new Date(data.endAt) <= new Date()) {
    throw new AppError("Invalid end date for ban", 400);
  }

  const ban = await banRepo.create(data);

  return ban;
};

export const unbanUserService = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const resultRemoveBan = await banRepo.removeActiveBan(userId);

  if (!resultRemoveBan) throw new AppError("User is not banned", 400);
};

export const getBanInfoService = async (userId: string) => {

  const user = await userRepo.findById(userId)

  if(!user) throw new AppError("User not found" , 404)

  const banUserInfo = await banRepo.getBanInfo(userId);

  if (!banUserInfo) throw new AppError("User is not banned", 400);

  return {
    user: banUserInfo.user,
    bannedBy: banUserInfo.bannedBy,
    reason: banUserInfo.reason,
    endAt: banUserInfo.endAt,
    createdAt: banUserInfo.createdAt,
  };
};
