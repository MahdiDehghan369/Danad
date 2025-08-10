import path from "path";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";
import fs from "fs"


export class uploadUserProfile {
  constructor(private userRepo: userRepository) {}

  async execute(userId: string , file: Express.Multer.File){
    validateObjectId(userId , "User")

    const user = await this.userRepo.findById(userId)

    if(!user){
        throw new AppError("User Not Found" , 404)
    }

    if(user.avatar){
        const avatarPath = path.join(__dirname , ".." , ".." , ".." , "public" , user.avatar)
        if(fs.existsSync(avatarPath)){
            fs.unlinkSync(avatarPath)
        }
    }

    const avatarPath = `profiles/${file.filename}`

    const result = await this.userRepo.findByIdAndUpdate(userId, { avatar: avatarPath});

    return {
      avatarPath: result?.avatar
    }
  }
}