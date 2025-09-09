import mongoose, { Types, UpdateResult } from "mongoose";
import walletModel, { IWallet } from "./wallet.model";
import { ITransaction } from "../transaction/transaction.model";


export interface ICreateWallet {
    user: string,
    balance: number
}


export const walletRepo = {
  findOne: async (condition: object): Promise<IWallet | null> =>
    await walletModel.findOne(condition),
  findOrCreate: async (
    data: ICreateWallet,
  ): Promise<IWallet> => {
    const wallet = await walletModel.findOne({ user: data.user });
    if (wallet) return wallet;

    const newWallet = await walletModel.create(data);
    return newWallet;
  },
  findOneAndupdate: async (
    condition: object,
    data: object,
  ): Promise<ITransaction | null> =>
    await walletModel.findOneAndUpdate(condition, data, { new: true }),
};