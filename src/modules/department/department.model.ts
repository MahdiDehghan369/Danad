import { Schema, model, Types } from "mongoose";

export interface IDepartment{
  _id: Types.ObjectId,
  name: string; 
  slug: string; 
  description?: string; 
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

departmentSchema.index({ name: 1, slug: 1 });

const departmentModel = model<IDepartment>(
  "Department",
  departmentSchema
);

export default departmentModel
