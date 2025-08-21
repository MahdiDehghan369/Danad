import banModel, { IBan } from "./ban.model";

export interface IBanUserService {
  user: string;
  reason: string;
  bannedBy?: string;
  endAt?: Date;
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
};
