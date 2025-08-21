import { AppError } from "../../utils/appError";
import { userRepo } from "../user/user.repo";
import { banRepo, IBanUserService } from "./ban.repo";

export const banUserService = async (data: IBanUserService) => {
  const user = await userRepo.findById(data.user);
  if (!user) throw new AppError("User not found :(", 404);

  const alreadyBanned = await banRepo.banActive(data.user);
  if (alreadyBanned) throw new AppError("User already banned :)", 409);

  if (data.endAt && new Date(data.endAt) <= new Date()) {
    throw new AppError("Invalid end date for ban", 400);
  }

  const ban = await banRepo.create(data);

  await userRepo.updateUserById(data.user , {isBlocked: true})

  return ban;
};
