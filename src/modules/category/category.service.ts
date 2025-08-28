import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { categoryRepo, ICategoryData } from "./category.repo";

export const createCategoryService = async(data: ICategoryData) => {
    data.slug = slugify(data.slug)
    const category = await categoryRepo.findOneBySlug(data.slug , data.type)

    if(category) throw new AppError("A category exists with this slug :(" , 409)

    const result = await categoryRepo.create(data)
    return result
}

export const getCategoryService = async(categoryId: string) => {

    const category = await categoryRepo.findById(categoryId)

    if(!category) throw new AppError("Category Not Found" , 404)

    return category

}