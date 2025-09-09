import { Schema, model, Types } from "mongoose";

export interface IWallet{
  _id: Types.ObjectId;
  user: Types.ObjectId;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    }
  },
  { timestamps: true }
);

const walletModel = model("Wallet", walletSchema);

export default walletModel