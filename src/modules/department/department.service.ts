import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { departmentRepo, ICreateDepartment, IEditDepartment } from "./department.repo";

export const createDepartmentService = async(data: ICreateDepartment) => {
    data.slug = slugify(data.slug)
    const existingSlugDepartment = await departmentRepo.findOne({slug: data.slug})

    if(existingSlugDepartment) throw new AppError("Department already exists with this slug" , 409)

    const department = await departmentRepo.create(data)

    return {department}

}

export const editDepartmentService = async(departmentId: string , data: IEditDepartment) => {

    const department = await departmentRepo.findOne({_id: departmentId})

    if(!department) throw new AppError("Department not found" , 404)

    data.slug = slugify(data.slug)
    const existingSlugDepartment = await departmentRepo.findOne({slug: data.slug})

    if(department._id.toString() !== existingSlugDepartment?._id.toString()) throw new AppError("Slug is already taken by another department", 409);

    const updatedDepartment = await departmentRepo.findOneAndUpdate({_id: departmentId} , data)

    return {department : updatedDepartment}

}

export const removeDepartmentService = async (departmentId: string) => {

    const department = await departmentRepo.findOne({_id: departmentId})

    if(!department) throw new AppError("Department not found" , 404)

    await departmentRepo.deleteOne({_id: departmentId})
}