import { AppError } from "../../../utils/appError";
import { slugify } from "../../../utils/slugify";
import { validateObjectId } from "../../../validators/validateObjetId";
import { ICategoryRepository } from "../../interfaces/ICategoryRepository";

interface ICreateCategory {
  title: string;
  slug: string;
  description: string;
  type: "blog" | "course";
  parent: string | null;
  isActive: boolean;
}


export class createCategory {
    constructor(private categoryRepo : ICategoryRepository){}

    async execute(data: ICreateCategory){
        data.slug = slugify(data.slug)
        data.type = data.type.trim().toLowerCase() as "blog" | "course"

        const existsSlug = await this.categoryRepo.findBySlugAndType(
          data.slug,
          data.type
        );

        if(existsSlug){
            throw new AppError("We have already category with this slug" , 409)
        }

        if(data.parent){
            validateObjectId(data.parent, "Parent category");
            const existsParentCat = await this.categoryRepo.findById(data.parent);

            if(!existsParentCat || existsParentCat.type === "blog"){
                throw new AppError("Parent Category not found" , 404)
            }
        }


        const createdCategory = await this.categoryRepo.save(data)

        return {
            category : createdCategory
        }

    }

}