import { Types } from "mongoose"
import categoryModel ,{ICategory} from "./category.model"

export interface ICategoryData {
    title: string,
    slug: string,
    description: string,
    type: "blog" | "course",
    createdBy: Types.ObjectId,
    status?: "active" | "inactive"
}

export const categoryRepo = {
    create: async (data: ICategoryData) : Promise<ICategory>=> await categoryModel.create(data),
    findOneBySlug: async (slug: string, type: string) : Promise<ICategory | null> => await categoryModel.findOne({slug, type}).lean(),
    findById: async (categoryId: string) : Promise<ICategory | null> => await categoryModel.findById(categoryId , "-__v -_id").populate("createdBy" , "name avatar username").lean()
}