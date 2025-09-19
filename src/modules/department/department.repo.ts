import departmentModel, { IDepartment } from "./department.model"

export interface ICreateDepartment {
    name: string,
    slug: string,
    description?: string,
    isActive?: boolean
}


export const departmentRepo = {
    create: async(data: ICreateDepartment) : Promise<IDepartment> => await departmentModel.create(data),
    findOne: async(condition: object) : Promise<IDepartment | null> => await departmentModel.findOne(condition)
}