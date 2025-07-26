import { RefreshToken } from "../../domain/entities/refreshToken";

export interface IRefreshTokenRepository {
  save(data: RefreshToken): Promise<void>;
  findByUserId(userId: string): Promise<RefreshToken | null>;
  findByToken(token: string): Promise<RefreshToken | null>;
  remove(token: string): Promise<boolean>;
  updateOne(token: string, newToken: string , expireIn: Date): Promise<boolean>;
}