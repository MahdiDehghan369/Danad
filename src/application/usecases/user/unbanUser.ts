import { BanRepository } from "../../../infrastructure/db/mongodb/repositories/banReposiroey";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";


export class unbanUserUseCase {
  constructor(
    private banRepo: BanRepository,
    private userRepo: userRepository
  ) {}

  async execute(userId: string) {
    validateObjectId(userId, "User");

    const existsUser = await this.userRepo.findById(userId);

    if (!existsUser) throw new AppError("User not found", 404);

    const isBanned = await this.banRepo.isUserBanned(userId);
    if (!isBanned) throw new AppError("User is not banned", 400);

    const unbanUser = await this.banRepo.deleteByUserId(userId)

    return true
  }
}
