import { AppError } from "../../utils/appError";
import { transactionRepo } from "./transaction.repo";

export const getAllTransactionsService = async (page = 1, limit = 20) => {
  const { transactions, total } = await transactionRepo.findAll(
    {},
    page,
    limit
  );

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const removeTransactionService = async (
  tranId: string,
  userId: string
) => {
  const transaction = await transactionRepo.findOne({ _id: tranId });

  if (!transaction) throw new AppError("Transaction not found", 404);

  if (transaction.user.toString() !== userId.toString()) {
    throw new AppError("You can not remove this transaction", 400);
  }

  await transactionRepo.deleteOne({ _id: tranId });
};

export const getTransactionService = async (tranId: string) => {
    const transaction = await transactionRepo.findOne({_id: tranId})

    if(!transaction) throw new AppError("Transaction not found" , 404)

    return transaction
}