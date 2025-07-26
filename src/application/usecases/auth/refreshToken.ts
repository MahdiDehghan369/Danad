import { AppError } from "../../../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { IRefreshTokenRepository } from "../../interfaces/IRefreshTokenRepository";

interface IRefreshToken {
    refreshToken : string;
}

export class RefreshToken {
  constructor(private repo: IRefreshTokenRepository) {}

  async execute({refreshToken}: IRefreshToken) {
    const foundToken = await this.repo.findByToken(refreshToken)

    if(!foundToken){
        throw new AppError("Refresh token not found", 404);
    }

    if(!foundToken.isValid()){
        await this.repo.remove(refreshToken)
        throw new AppError("Refresh token is expired or invalid", 422);
    }

     const userId = foundToken.user;
    const newRefreshToken = generateRefreshToken({ _id: userId });
    const newAccessToken = generateAccessToken({ _id: userId });

    const expireIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15);

    const updateToken = await this.repo.updateOne(
      refreshToken,
      newRefreshToken,
      expireIn
    );

    if(!updateToken){
        throw new AppError("Failed to update refresh token", 500);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

  }
}
