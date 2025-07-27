import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";



export class getUserInformation {
    constructor(private userRepo: userRepository){}

    async exeute(userId: string){
        validateObjectId(userId , "User")

        const user = await this.userRepo.findById(userId)

        if(!user){
            throw new AppError("User not found" , 404)
        }

        return {
            user: user.withoutPassword()
        }
    }
}