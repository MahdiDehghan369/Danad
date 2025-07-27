import { isValidObjectId } from "mongoose";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";



export class removeUserByAdmin {
    constructor(private userRepo: userRepository){}

    async execute(userId : string){
        validateObjectId(userId , "User")

        const foundUser = await this.userRepo.findById(userId)

        if(!foundUser){
            throw new AppError("User not found", 404);
        }

        await this.userRepo.findByIdAndDelete(userId)

        return true
    }
}