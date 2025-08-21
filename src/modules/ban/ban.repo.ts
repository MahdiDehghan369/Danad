import banModel, { IBan } from "./ban.model";

export interface IBanUserService {
  user: string;
  reason: string;
  bannedBy?: string;
  endAt?: Date;
}

export interface IGetBanUsersQuery {
  status?: "active" | "expired";
  bannedBy?: string;
  limit?: number;
  page?: number;
}

interface IBanUsersResult {
  data: IBan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface IEditBanData {
  reason?: string,
  endAt?: Date
}

export const banRepo = {
  create: async (data: IBanUserService): Promise<IBan> =>
    await banModel.create(data),
  banActive: async (user: string): Promise<IBan | null> =>
    await banModel.findOne({
      user,
      $or: [{ endAt: { $gte: new Date() } }, { endAt: null }],
    }),
  removeActiveBan: async (user: string): Promise<IBan | null> =>
    await banModel.findOneAndDelete({
      user,
      $or: [{ endAt: { $gte: new Date() } }, { endAt: null }],
    }),
  getBanInfo: async (
    userId: string
  ): Promise<(IBan & { user?: any; bannedBy?: any }) | null> =>
    await banModel
      .findOne({
        user: userId,
        $or: [{ endAt: { $gte: new Date() } }, { endAt: null }],
      })
      .populate("user", "fullname email username avatar")
      .populate("bannedBy", "fullname email username avatar"),
  getBanUsers: async (query: IGetBanUsersQuery): Promise<IBanUsersResult> => {
    const { status, bannedBy } = query;

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;

    const filter: any = {};

    console.log(status === "active");

    if (status === "active") {
      filter.$or = [{ endAt: { $gte: new Date() } }, { endAt: null }];
    } else if (status === "expired") {
      filter.endAt = { $lte: new Date() };
    }

    if (bannedBy) {
      filter.bannedBy = bannedBy;
    }

    const skip = (page - 1) * limit;

    const bans = await banModel
      .find(filter)
      .populate("user", "username email fullname avatar")
      .populate("bannedBy", "username email fullname avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await banModel.countDocuments(filter);

    return {
      data: bans,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },
  updateOne: async (banId: string ,data: IEditBanData): Promise<IBan | null> => {
    const ban = await banModel.findOneAndUpdate({ _id: banId }, data, {
      new: true,
    });
    return ban
  },
};
