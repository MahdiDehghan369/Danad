import mongoose from "mongoose";
import transactionModel, { ITransaction } from "./transaction.model";

export interface IDepositData {
  user: string;
  wallet: string;
  type: "deposit" | "purchase" | "refund" | "gift";
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
    await transactionModel.find(condition , "-__v -user -wallet").sort({ createdAt: -1 }),
};
