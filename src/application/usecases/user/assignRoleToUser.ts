import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";



export class assignRoleToUser {
    constructor(private userRepo : userRepository){}

    async execute(adminId: string , userId: string , role: string){
            validateObjectId(adminId, "Admin");
            validateObjectId(userId, "User");

                if (adminId === userId) {
                  throw new AppError("You cannot change your own role", 400);
                }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    if (user.role === role.toUpperCase()) {
      throw new AppError("User already has this role", 400);
    }

        await this.userRepo.findByIdAndUpdate(userId , {role: role.toUpperCase()})

    }
}