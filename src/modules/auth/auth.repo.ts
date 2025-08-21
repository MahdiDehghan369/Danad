import UserModel, { UserRole } from "./../user/user.model";

interface IRegisterUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

export const authRepo = {
  create: async (date: Partial<IRegisterUser>) => await UserModel.create(date),
  findByEmail: async (email: string) =>
    await UserModel.findOne({ email }),
  findByPhone: async (phone: string) =>
    await UserModel.findOne({ phone }),
  findByUsername : async (username: string) => await UserModel.findOne({username}),
  countuser : async () => await UserModel.countDocuments()
};
