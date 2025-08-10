import { IBanRepository } from "../../../../application/interfaces/IBanRepository";
import { Ban } from "../../../../domain/entities/ban";
import {banModel} from "../models/ban.model"
import { userModel } from "../models/user.model";

interface ISaveBan {
  user: string;
  bannedBy : string;
  reason: string;
  expiresAt?: Date;
}

interface UserQueryOptions {
  bannedBy?: string;
  page?: number;
  limit?: number;
}

export class BanRepository implements IBanRepository {
  async save(data: ISaveBan): Promise<Ban> {
    const banUser = await banModel.create(data);

    await userModel.findOneAndUpdate({ _id: data.user }, { isBlocked: true });

    return new Ban(
      banUser._id as string,
      banUser.user.toString(),
      banUser.bannedBy.toString(),
      banUser.reason,
      banUser.expiresAt,
      banUser.createdAt,
      banUser.updatedAt
    );
  }

  async deleteByUserId(userId: string): Promise<void> {
    const removedUser = await banModel.findOneAndDelete({ user: userId });
    await userModel.findOneAndUpdate({ _id: userId }, { isBlocked: false });
  }

  async isUserBanned(userId: string): Promise<boolean> {
    const exists = await banModel.exists({
      user: userId,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });

    return !!exists;
  }

  async getBannedUsers(options: UserQueryOptions): Promise<{
    bannedUsersData: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (options.bannedBy) {
      query.bannedBy = options.bannedBy;
    }

    const [bannedUsersData, total] = await Promise.all([
      banModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate("user", "-password -__v")
        .lean(),
      banModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      bannedUsersData,
      total,
      page,
      limit,
      totalPages,
    };
  }
}