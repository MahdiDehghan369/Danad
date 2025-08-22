import userModel, { UserRole } from "./user.model";
import UserModel, { IUser } from "./user.model";

export interface IEditUserInfo {
    email: string,
    username: string,
    fullname: string
}

export interface IGetUsersQuery {
  role?: UserRole,
  page?: number,
  limit?: number
}

interface IGetUsersResult {
  users: IUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
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
    const user = UserModel.findOneAndUpdate({ _id: userId }, data , {new: true});
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
  findOneAndDelete: async (condition: object): Promise<IUser | null> => {
    const user = await UserModel.findOneAndDelete(condition);
    return user;
  },
  findOneAndUpdate: async (
    condition: object,
    data: object
  ): Promise<IUser | null> => {
    const user = await userModel.findOneAndUpdate(condition, data, {new: true});
    return user;
  },
  find: async (query: IGetUsersQuery): Promise<IGetUsersResult> => {

    const filter: any = {}

    if(query.role === "admin"){
      filter.role = "admin"
    } else if(query.role === "teacher"){
      filter.role = "teacher"
    } else if(query.role === "student"){
      filter.role = "student"
    }

    const page: number = query.page ? Number(query.page) : 1;
    const limit: number = query.limit ? Number(query.limit) : 10;

    const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
  ]);

    return {
      users: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },
};