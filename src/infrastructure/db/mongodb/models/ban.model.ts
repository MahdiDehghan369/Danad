// src/domain/models/Ban.ts

import { Schema, model, Types, Document } from "mongoose";

export interface IBan extends Document {
  user: Types.ObjectId;
  bannedBy: Types.ObjectId;
  reason: string; 
  expiresAt?: Date; 
  createdAt: Date; 
  updatedAt: Date; 
}

const banSchema = new Schema<IBan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    bannedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: 5,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const banModel = model<IBan>("ban", banSchema);
