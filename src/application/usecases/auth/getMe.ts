import { IUserRepository } from "../../interfaces/IUserRepository";
import { AppError } from "../../../utils/appError";


export class GetMe {
    constructor(private userRepo: IUserRepository){}

    async exeute(userId : string){
        const user = await this.userRepo.findById(userId)

        if(!user){
            throw new AppError("User not found" , 404)
        }

        return {
            user: user.withoutPassword()
        }
    }
}