import mongoose, { Schema , model , Document } from "mongoose";

interface ICategory extends Document {
    title: string,
    slug: string,
    description: string,
    type: "blog" | "course",
    parent?: mongoose.Types.ObjectId,
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const categorySchema = new Schema<ICategory>({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["blog" , "course"],
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "category",
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    }
} , {timestamps: true})


export const categoryModel = model<ICategory>("category" , categorySchema)