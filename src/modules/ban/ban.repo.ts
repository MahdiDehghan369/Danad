import banModel, { IBan } from "./ban.model";

export interface IBanUserService {
  user: string;
  reason: string;
  bannedBy?: string;
  endAt?: Date
}


export const banRepo = {
  create: async (data: IBanUserService) : Promise<IBan> => await banModel.create(data),
  banActive: async (user: string) : Promise<IBan | null> =>
    await banModel.findOne({
      user,
      $or: [{ endAt: { $gte: new Date() } }, { endAt: null }],
    }),
};