import { AppError } from "../../utils/appError";
import { UserRole } from "../user/user.model";
import { authRepo } from "./auth.repo";

interface IRegisterUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole
}

export const registerService = async (data: Partial<IRegisterUser>) => {
  const usernameExists = await authRepo.findByUsername(data.username as string);

  if (usernameExists) throw new AppError("Username already exists", 409);

  const emailExists = await authRepo.findByEmail(data.email as string);

  if (emailExists) throw new AppError("Email already exists", 409);

  const phoneExists = await authRepo.findByPhone(data.phone as string);

  if (phoneExists) throw new AppError("Phone already exists", 409);

  const countUser = await authRepo.countuser()

  data.role = countUser > 0 ? "student" : "admin"

  const user = await authRepo.create(data);

  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone
  };
};
