import { IDepositData, transactionRepo } from "../transaction/transaction.repo";
import {walletRepo } from "./wallet.repo";

export const deposit = async (userId: string , data: IDepositData) => {

    const wallet = await walletRepo.findOrCreate({user: userId , balance: 0})

    const transaction = await transactionRepo.create(data)

    if(transaction){
        await walletRepo.findOneAndupdate({wallet: wallet._id , user: userId} , {balance : balance + data.amount})
    }

    return {wallet , transaction}

}