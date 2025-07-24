import { IUserRepository } from "../../interfaces/IUserRepository";
import { AppError } from "../../../utils/appError";
import { generateAccessToken , generateRefreshToken } from "../../../utils/jwt";
import { refreshTokenModel } from "../../../infrastructure/db/mongodb/models/refreshToken.model";

interface ILoginWithEmail {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
}


export class LoginUserWithEmail {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: ILoginWithEmail){
    const user = await this.userRepo.findByEmail(data.email)

    if(!user) throw new AppError("User not found" , 404)

    if(user.isBlocked) throw new AppError("User Bloked" , 403)

    const match = await user.comparePassword(data.password)

    if(!match) throw new AppError("Email or Password wring" , 422)

    
    const accessToken = generateAccessToken({_id: user._id})
    const refreshToken = generateRefreshToken({_id: user._id})

    await refreshTokenModel.deleteMany({
      user: user._id,
      ip: data.ip,
      userAgent: data.userAgent,
    });


    await refreshTokenModel.create({
      token: refreshToken,
      user: user._id,
      ip: data.ip,
      userAgent: data.userAgent,
      expireIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    });

    return {
      accessToken,
      refreshToken,
      user: user.withoutPassword()
    }

  }
}