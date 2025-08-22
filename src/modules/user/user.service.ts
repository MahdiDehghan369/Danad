import { AppError } from "../../utils/appError";
import { banRepo } from "../ban/ban.repo";
import { IUser, UserRole } from "./user.model";
import { IEditUserInfo, userRepo } from "./user.repo";
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

  const result = await userRepo.updateUserById(userId , data) as IUser

  return result
};

export const removeUserService = async (userId: string) => {
  const user = await userRepo.findOneAndDelete({_id: userId})

  if(!user) throw new AppError("User not found :(" , 404)

  await banRepo.removeUser(userId)

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname
  }
}

export const getUserInfoService = async (userId: string) => {
  const user = await userRepo.findById(userId)

  if(!user) throw new AppError("User not found" , 404)

    user.password = ""

    return user
}

export const changeUserRoleService = async (userId: string , role: UserRole) => {

  const user = await userRepo.findById(userId)

  if(!user) throw new AppError("User not found" , 404)

  if(user.role === role) throw new AppError("The user has this role" , 409)

  await userRepo.findOneAndUpdate({_id: userId} , {role})

}