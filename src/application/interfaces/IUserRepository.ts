import { User } from "./../../domain/entities/user";


export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  getCountDocuments(): Promise<number>;
  findByIdAndUpdate(
    userId: string,
    data: object
  ): Promise<User | null>;
  findByIdAndDelete(userId: string): Promise<true | null>
}