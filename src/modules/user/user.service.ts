import { AppError } from "../../utils/appError";
import { userRepo } from "./user.repo";
import bcrypt from "bcrypt";

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const matchPassword = await user.comparePassword(currentPassword);

  if (!matchPassword) throw new AppError("Password is wrong", 422);

  if(await user.comparePassword(newPassword)){
    throw new AppError("New password cannot be the same as old password", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await userRepo.updateUserById(userId, { password: hashedPassword });
};
