import { Document , Types , Schema , model } from "mongoose";

export interface IBan {
    user: Types.ObjectId,
    reason: string,
    bannedBy: Types.ObjectId,
    endAt?: Date,
    createdAt: Date,
    updatedAt: Date
}

const banSchema = new Schema<IBan>({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    reason: {
        type: String,
        required: true
    },
    bannedBy: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    endAt: {
        type: Date,
        default: null
    }
} , {
    timestamps: true
})

const banModel = model<IBan>("Ban" , banSchema)

export default banModel