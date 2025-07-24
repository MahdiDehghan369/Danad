import { IUserRepository } from "../../../../application/interfaces/IUserRepository";
import { User } from "../../../../domain/entities/user";
import { userModel } from "../models/user.model";

export class userRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    const userData = new userModel(user);
    await userData.save();
    return new User(
      userData._id.toString(),
      userData.email,
      userData.phone,
      userData.username,
      userData.password,
      userData.role,
      userData.isVerified,
      userData.isBlocked,
      userData.avatar,
      userData.fullname
    ).withoutPassword();
  }

  async findById(id: string): Promise<User | null> {
    const data = await userModel.findById(id).lean();

    return data
      ? new User(
          data._id.toString(),
          data.email,
          data.phone,
          data.username,
          data.password,
          data.role,
          data.isVerified,
          data.isBlocked,
          data.avatar,
          data.fullname
        )
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await userModel.findOne({ email }).lean();

    if (!data) return null;

    return new User(
      data._id.toString(),
      data.email,
      data.phone,
      data.username,
      data.password,
      data.role,
      data.isVerified,
      data.isBlocked,
      data.avatar,
      data.fullname
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const data = await userModel.findOne({ username }).lean();

    if (!data) return null;

    return new User(
      data._id.toString(),
      data.email,
      data.phone,
      data.username,
      data.password,
      data.role,
      data.isVerified,
      data.isBlocked,
      data.avatar,
      data.fullname
    );
  }

  async findByPhone(phone: string): Promise<User | null> {
    const data = await userModel.findOne({ phone }).lean();

    if (!data) return null;

    return new User(
      data._id.toString(),
      data.email,
      data.phone,
      data.username,
      data.password,
      data.role,
      data.isVerified,
      data.isBlocked,
      data.avatar,
      data.fullname
    );
  }
}
