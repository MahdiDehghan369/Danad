import { IUserRepository } from "../../interfaces/IUserRepository";
import { User } from "../../../domain/entities/user";


export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: {
    fullname: string;
    email: string;
    phone: string;
    username: string;
    password: string;
  }) {
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