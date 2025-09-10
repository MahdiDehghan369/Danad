import mongoose from "mongoose";
import { IDepositData, transactionRepo } from "../transaction/transaction.repo";
import { walletRepo } from "./wallet.repo";
import { generateRefId } from "../../utils/generateRefId";
import { AppError } from "../../utils/appError";
import { userRepo } from "../user/user.repo";
import { banRepo } from "../ban/ban.repo";

export const depositService = async (userId: string, data: IDepositData) => {
  const wallet = await walletRepo.findOrCreate({ user: userId, balance: 0 });

  const transaction = await transactionRepo.create({
    ...data,
    user: userId,
    type: "deposit",
    wallet: wallet._id.toString(),
    refId: generateRefId(),
  });

  const updatedWallet = await walletRepo.findOneAndupdate(
    { user: userId },
    { $inc: { balance: data.amount } }
  );

  return { wallet: updatedWallet, transaction };
};

export const getTransactionsService = async (userId: string) => {
  const transactions = await transactionRepo.find({ user: userId });

  return transactions;
};

export const getWalletBalanceService = async (userId: string) => {
  const wallet = await walletRepo.findOne({ user: userId });

  if (!wallet) throw new AppError("User doesn't have wallet", 404);

  return { balance: wallet.balance };
};

export const giftDepositService = async (
  userId: string,
  data: IDepositData
) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const userBanned = await banRepo.getBanInfo(userId)

  if(userBanned) throw new AppError("User already banned" , 400)

  const wallet = await walletRepo.findOrCreate({ user: userId, balance: 0 });

  const transaction = await transactionRepo.create({
    ...data,
    user: userId,
    type: "gift",
    wallet: wallet._id.toString(),
    refId: generateRefId(),
  });

  const updatedWallet = await walletRepo.findOneAndupdate(
    { user: userId },
    { $inc: { balance: data.amount } }
  );

  return { wallet: updatedWallet, transaction };
};
