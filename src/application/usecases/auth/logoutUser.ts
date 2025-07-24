import { IRefreshTokenRepository } from "../../interfaces/IRefreshTokenRepository";
import { AppError } from "../../../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { refreshTokenModel } from "../../../infrastructure/db/mongodb/models/refreshToken.model";

interface ILogoutUser {
    refreshToken: string
}


export class LogoutUser {
  constructor(private refreshTokenRepo: IRefreshTokenRepository) {}

  async execute(data: ILogoutUser){


    const foundToken = await this.refreshTokenRepo.findByToken(data.refreshToken)


    if(!foundToken) throw new AppError("No refrsh token exists" , 404)

    await this.refreshTokenRepo.remove(data.refreshToken)

    return true

  }
}