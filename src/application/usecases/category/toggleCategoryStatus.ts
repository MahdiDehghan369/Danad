import { CategoryRepository } from "../../../infrastructure/db/mongodb/repositories/categoryRepository";
import { AppError } from "../../../utils/appError";
import { slugify } from "../../../utils/slugify";



export class toggleCategoryStatus {
    constructor(private categoryRepo: CategoryRepository){}

    async execute(slug : string){
        slug = slugify(slug)

        const foundCategory = await this.categoryRepo.findBySlug(slug)

        if(!foundCategory){
            throw new AppError("Category not found" , 404)
        }

        let isActive = foundCategory.isCategoryActive()

        if(isActive){
            isActive = false
        }else {
            isActive = true
        }

       const updatedCategory =  await this.categoryRepo.findByIdAndUpdate(foundCategory._id , {isActive})

        return {
            category : updatedCategory
        }
    }
}