import { CategoryRepository } from "../../../infrastructure/db/mongodb/repositories/categoryRepository";
import { AppError } from "../../../utils/appError";
import { slugify } from "../../../utils/slugify";



export class getCategoryInfo {
    constructor(private categoryRepo: CategoryRepository){}

    async execute(slug: string){
        slug = slugify(slug)

        const foundCategory = await this.categoryRepo.findBySlug(slug)

        if(!foundCategory){
            throw new AppError("Category not found" , 404)
        }

        return {
            category : foundCategory
        }
    }
}