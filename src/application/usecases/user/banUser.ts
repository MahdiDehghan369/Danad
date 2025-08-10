import { BanRepository } from "../../../infrastructure/db/mongodb/repositories/banReposiroey";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";

interface ISaveBan {
  user: string;
  bannedBy: string;
  reason: string;
  expiresAt?: Date;
}

export class banUserUseCase {
  constructor(
    private banRepo: BanRepository,
    private userRepo: userRepository
  ) {}

  async execute(data: ISaveBan) {
    validateObjectId(data.user, "User");
    validateObjectId(data.bannedBy, "Admin");

    const existsUser = await this.userRepo.findById(data.user);

    if (!existsUser) throw new AppError("User not found", 404);

    const existsAdmin = await this.userRepo.findById(data.bannedBy);

    if (!existsAdmin) throw new AppError("Admin not found", 404);
    if (existsAdmin.role != "ADMIN")
      throw new AppError("Only admins can ban users", 403);

    const isBanned = await this.banRepo.isUserBanned(data.user);
    if (isBanned) throw new AppError("User is already banned", 400);

    const banUser = await this.banRepo.save(data);

    return {
      user: banUser,
    };
  }
}
