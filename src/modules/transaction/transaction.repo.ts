import mongoose, { DeleteResult } from "mongoose";
import transactionModel, { ITransaction } from "./transaction.model";

export interface IDepositData {
  user: string;
  wallet: string;
  type: "deposit" | "purchase" | "refund" | "gift" | "manual";
  amount: number;
  description: string;
  gateway: "zarinpal" | "manual";
  refId: string;
}

export const transactionRepo = {
  create: async (data: IDepositData): Promise<ITransaction> => {
    const transaction = await transactionModel.create(data);
    return transaction;
  },
  find: async (condition: object): Promise<ITransaction[] | []> =>
    await transactionModel
      .find(condition, "-__v -user -wallet")
      .sort({ createdAt: -1 }),
  findAll: async (filter = {}, page = 1, limit = 20) => {
    const transactions = await transactionModel.find(filter, {
      amount: 1,
      type: 1,
      status: 1,
      refId: 1,
      user: 1,
      createdAt: 1,
    })
      .populate("user", "fullname email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await transactionModel.countDocuments(filter);

    return { transactions, total };
  },
  findOne: async (condition:object) : Promise<ITransaction | null> => await transactionModel.findOne(condition).populate("user", "fullname username avatar").populate("wallet" , "-__v -user"),
  deleteOne: async (condition: object) : Promise<DeleteResult>  => await transactionModel.deleteOne(condition)
};
