import { BanRepository } from "../../../infrastructure/db/mongodb/repositories/banReposiroey";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";

interface UserQueryOptions {
  bannedBy?: string;
  page?: number;
  limit?: number;
}

export class getAllBannedUsers {
    constructor(private banRepo: BanRepository , private userRepo: userRepository){}

    async execute(option: UserQueryOptions){

        if(option.bannedBy){
        validateObjectId(option.bannedBy , "Admin")

        const existsAdmin = await this.userRepo.findById(option.bannedBy)

        if(!existsAdmin || existsAdmin.role != "ADMIN") throw new AppError("Admin not found" , 404)
        }


        const bannedUsers = await this.banRepo.getBannedUsers(option)

        return bannedUsers
        
    }
} 