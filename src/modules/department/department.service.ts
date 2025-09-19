import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { departmentRepo, ICreateDepartment } from "./department.repo";

export const createDepartmentService = async(data: ICreateDepartment) => {
    data.slug = slugify(data.slug)
    const existingSlugDepartment = await departmentRepo.findOne({slug: data.slug})

    if(existingSlugDepartment) throw new AppError("Department already exists with this slug" , 409)

    const department = await departmentRepo.create(data)

    return {department}

} 