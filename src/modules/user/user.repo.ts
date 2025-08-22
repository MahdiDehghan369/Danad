import userModel from "./user.model";
import UserModel, { IUser } from "./user.model";

export interface IEditUserInfo {
    email: string,
    username: string,
    fullname: string
}

export const userRepo = {
  findById: async (userId: string): Promise<IUser | null> => {
    const user = await UserModel.findById(userId);
    if (!user) return null;
    return user;
  },
  updateUserById: async (
    userId: string,
    data: object
  ): Promise<IUser | null> => {
    const user = UserModel.findOneAndUpdate({ _id: userId }, data);
    if (!user) return null;

    return user;
  },
  findByEmail: async (email: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ email });
    return user;
  },
  findByUsername: async (username: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ username });
    return user;
  },
  findOneAndDelete: async(condition:object) : Promise<IUser | null> => {
    const user = await UserModel.findOneAndDelete(condition)
    return user
  },
  findOneAndUpdate: async(condition: object , data: object) : Promise<IUser | null> => {
    const user = await userModel.findOneAndUpdate(condition , data)
    return user
  }
};