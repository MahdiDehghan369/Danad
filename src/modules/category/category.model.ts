import { Types , Document , Schema , model } from "mongoose";

export interface ICategory extends Document {
    title: string,
    slug: string,
    description: string,
    type: "blog" | "course",
    status: "active" | "inactive"
    createdBy: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}


const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["blog" , "course"],
        required: true
    },
    status: {
        type: String,
        enum: ["active" , "inactive"],
        default: "active"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

const categoryModel = model<ICategory>("Category" , categorySchema)

export default categoryModel