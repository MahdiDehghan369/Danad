import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";

interface GetUserOptions {
  isBlocked?: string;
  page?: number;
  limit?: number;
}



export class getAllUsers {
  constructor(private userRepo: userRepository) {}

  async execute(option: GetUserOptions) {
    const users = await this.userRepo.findAllUsers(option);

    return users;
  }
}