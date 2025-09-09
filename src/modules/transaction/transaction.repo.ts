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
    create: async (data: IDepositData) : Promise<ITransaction> => await transactionModel.create(data)
}