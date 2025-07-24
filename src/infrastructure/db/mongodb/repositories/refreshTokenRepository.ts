import { IRefreshTokenRepository } from "../../../../application/interfaces/IRefreshTokenRepository";
import { refreshTokenModel } from "../models/refreshToken.model";
import { RefreshToken } from "../../../../domain/entities/refreshToken";

export class RefreshTokenRepository implements IRefreshTokenRepository {
    async save(data: RefreshToken): Promise<void> {
        const tokenData = new refreshTokenModel(data)
        await tokenData.save()
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        const refreshToken = await refreshTokenModel.findOne({token})


        if(!refreshToken) return null

        return new RefreshToken(
            refreshToken._id.toString(),
            refreshToken.token,
            refreshToken.user.toString(),
            refreshToken.ip,
            refreshToken.userAgent,
            refreshToken.expireIn,
        )
    }

    async findByUserId(userId: string): Promise<RefreshToken | null> {
        const refreshToken = await refreshTokenModel.findOne({ user: userId });

        if (!refreshToken) return null;

        return new RefreshToken(
          refreshToken._id.toString(),
          refreshToken.token,
          refreshToken.user.toString(),
          refreshToken.ip,
          refreshToken.userAgent,
          refreshToken.expireIn
        );
    }

    async remove(token: string): Promise<boolean> {
        const removedRefreshToken = await refreshTokenModel.findOneAndDelete({token})

        if(!removedRefreshToken) return false

        return true
    }
}