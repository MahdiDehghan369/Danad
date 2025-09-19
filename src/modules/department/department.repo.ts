import { DeleteResult } from "mongoose";
import departmentModel, { IDepartment } from "./department.model"

export interface ICreateDepartment {
    name: string,
    slug: string,
    description?: string,
    isActive?: boolean
}

export interface IEditDepartment {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}


export const departmentRepo = {
    create: async(data: ICreateDepartment) : Promise<IDepartment> => await departmentModel.create(data),
    findOne: async(condition: object) : Promise<IDepartment | null> => await departmentModel.findOne(condition),
    findOneAndUpdate: async(condition: object , data: Partial<IEditDepartment>) : Promise<IDepartment | null> => await departmentModel.findOneAndUpdate(condition , data , {new: true}),
    deleteOne: async (condition: object) : Promise<DeleteResult> => await departmentModel.deleteOne(condition)
}