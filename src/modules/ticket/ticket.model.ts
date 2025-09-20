import { Schema, model, Types, Document } from "mongoose";

export type TicketStatus = "open" | "pending" | "closed" | "answered";

export interface ITicketMessage {
  sender: Types.ObjectId;
  message: string;
  createdAt?: Date;
}

export interface ITicket extends Document {
  user: Types.ObjectId; 
  department: Types.ObjectId; 
  subject: string;
  messages: ITicketMessage[];
  status: TicketStatus;
  isActive: boolean;
  closedAt?: Date,
  createdAt?: Date;
  updatedAt?: Date;
}

const TicketMessageSchema = new Schema<ITicketMessage>(
  {
    sender: { type: Schema.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const TicketSchema = new Schema<ITicket>(
  {
    user: { type: Schema.ObjectId, ref: "User", required: true },
    department: { type: Schema.ObjectId, ref: "Department", required: true },
    subject: { type: String, required: true, trim: true },
    messages: [TicketMessageSchema],
    status: {
      type: String,
      enum: ["open", "pending", "closed", "answered"],
      default: "open",
    },
    isActive: { type: Boolean, default: true },
    closedAt: Date
  },
  { timestamps: true }
);

const ticketModel = model<ITicket>("Ticket", TicketSchema);

export default ticketModel 
