import path from "path";
import fs from "fs";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";

export class removeUserProfile {
  constructor(private userRepo: userRepository) {}

  async execute(userId: string) {
    validateObjectId(userId, "User");

    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    if (!user.avatar) {
      throw new AppError("No Exists Profile", 400);
    }

    const avatarPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      user.avatar
    );
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    await this.userRepo.findByIdAndUpdate(userId, { avatar: null });
  }
}
