import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";
import bcrypt from "bcrypt"

export class changeUserPassword {
    constructor(private userRepo: userRepository){}

    async execute(userId: string , currentPassword: string , newPassword: string) {
      validateObjectId(userId, "User");

      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User Not Found", 404);
      }

      const userPassword = user.getPassword();
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        userPassword
      );

      if (!isPasswordMatch) {
        throw new AppError("Current password is incorrect", 409);
      }
      const newHashedPassword = await bcrypt.hash(newPassword , 12)

      this.userRepo.findByIdAndUpdate(userId, { password: newHashedPassword });
    }
}