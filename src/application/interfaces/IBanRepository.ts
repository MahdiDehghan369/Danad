import { Ban } from "../../domain/entities/ban"

interface ISaveBan {
    user: string,
    bannedBy: string,
    reason: string,
    expiresAt?: Date
}

interface UserQueryOptions {
  bannedBy?: string;
  page?: number;
  limit?: number;
}

export interface IBanRepository {
  save(data: ISaveBan): Promise<Ban>;
  deleteByUserId(userId: string): Promise<void>;
  isUserBanned(userId: string): Promise<boolean>;
  getBannedUsers(options: UserQueryOptions): Promise<{
    bannedUsersData: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}