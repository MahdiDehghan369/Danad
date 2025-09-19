import { Schema, model, Types } from "mongoose";

export type TicketStatus = "open" | "pending" | "closed";

export interface ITicketMessage {
  sender: Types.ObjectId;
  message: string;
  createdAt?: Date;
  attachments?: string[];
}

export interface ITicket {
  user: Types.ObjectId; 
  department: Types.ObjectId; 
  subject: string;
  messages: ITicketMessage[];
  status: TicketStatus;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TicketMessageSchema = new Schema<ITicketMessage>(
  {
    sender: { type: Schema.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
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
      enum: ["open", "pending", "closed"],
      default: "open",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ticketModel = model<ITicket>("Ticket", TicketSchema);

export default ticketModel 
