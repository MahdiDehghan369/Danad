import { IUserRepository } from "../../interfaces/IUserRepository";
import { User } from "../../../domain/entities/user";
import { AppError } from "../../../utils/appError";

interface IRegisterUser {
  fullname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: IRegisterUser) {
    const existsUsername = await this.userRepo.findByUsername(data.username);
    const existsEmail = await this.userRepo.findByEmail(data.email);
    const existsPhone = await this.userRepo.findByPhone(data.phone);

    if (existsUsername) {
      throw new AppError("Username already exists", 409);
    } else if (existsEmail) {
      throw new AppError("Email already exists", 409);
    } else if (existsPhone) {
      throw new AppError("Phone already exists", 409);
    }

    const user = new User(
      data.fullname,
      data.email,
      data.phone,
      data.username,
      data.password
    );

    return await this.userRepo.save(user);
  }
}
