import { CategoryRepository } from "../../../infrastructure/db/mongodb/repositories/categoryRepository";
import { AppError } from "../../../utils/appError";
import { slugify } from "../../../utils/slugify";


export class deleteCategory {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(slug: string, mode: "cascade" | "detach") {
    slug = slugify(slug);

      const foundCategory = await this.categoryRepo.findBySlug(slug)

        if(!foundCategory){
            throw new AppError("Category not found" , 404)
        }

    if(mode === "cascade"){
      await this.categoryRepo.deleteCategoryCascade(foundCategory._id)
    } else if(mode === "detach") {
await this.categoryRepo.deleteCategoryDetach(foundCategory._id)
    }

    return true


  }
}