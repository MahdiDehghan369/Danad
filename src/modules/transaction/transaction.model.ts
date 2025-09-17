import { Schema, model, Types } from "mongoose";

export interface ITransaction {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  wallet: Types.ObjectId;
  type: "deposit" | "purchase" | "refund" | "gift" | "manual";
  amount: number;
  status: "pending" | "success" | "failed";
  description: string;
  gateway: "zarinpal" | "manual";
  refId: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "purchase", "refund", "gift", "manual"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success",
    },
    description: {
      type: String,
    },
    gateway: {
      type: String,
      enum: ["zarinpal", "manual"],
    },
    refId: {
      type: String,
    },
  },
  { timestamps: true }
);

const transactionModel = model("Transaction", transactionSchema);

export default transactionModel