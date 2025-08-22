import refreshTokenModel from "./refresh.model";
import RefreshTokenModel from "./refresh.model"

export interface ICreateRefreshToken {
      token: string;
      user: string;
      ip: string;
      userAgent: string;
      expireIn: Date;
}

interface IUpdateRefreshToken {
    token: string,
    expireIn: Date
}

export const refreshTokenRepo = {
  create: async (data: ICreateRefreshToken) =>
    await RefreshTokenModel.create(data),
  findByIpAndUserAgent: async (ip: string, userAgent: string) =>
    await RefreshTokenModel.findOne({ ip, userAgent }),
  findOne: async (data: object) => await RefreshTokenModel.findOne(data),
  updateOne: async (condition: string, data: IUpdateRefreshToken) =>
    await RefreshTokenModel.updateOne({ token: condition }, data),
  findOneByTokenAndDelete : async (token: string) => await RefreshTokenModel.findOneAndDelete({token}),
  find: async (condition: object) => await RefreshTokenModel.find(condition , {token: 0}),
  removeById: async (id: string) => await refreshTokenModel.deleteOne({_id: id}),
  findById: async (id: string) => await refreshTokenModel.findOne({_id: id})
};