import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { AppError } from "../../../utils/appError";
import { validateObjectId } from "../../../validators/validateObjetId";

interface IUpdateUserInfo {
  fullname: string;
  email: string;
  username: string;
}

export class updateUser {
  constructor(private userRepo: userRepository) {}

  async execute(userId: string, data: IUpdateUserInfo) {
    validateObjectId(userId, "User");

    const foundUser = await this.userRepo.findById(userId)

    if(!foundUser){
        throw new AppError("User not found" , 404)
    }

    const existsEmail = await this.userRepo.findByEmail(data?.email)

    if(existsEmail?._id != userId){
        throw new AppError("Email already exists" , 409)
    }

    const existsUsername = await this.userRepo.findByUsername(data?.username)

    if (existsUsername?._id != userId) {
      throw new AppError("Username already exists", 409);
    }

    const updatedUser = await this.userRepo.findByIdAndUpdate(userId , data)

    return {
      user: updatedUser,
    };

  }
}
