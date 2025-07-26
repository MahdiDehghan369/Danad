import { CategoryRepository } from "../../../infrastructure/db/mongodb/repositories/categoryRepository";
import { AppError } from "../../../utils/appError";
import { slugify } from "../../../utils/slugify";
import { validateObjectId } from "../../../validators/validateObjetId";

interface IEditCategoryInput {
  title: string;
  slug: string;
  description: string;
  type: "course" | "blog";
  parent: string | null;
  isAvtive: boolean;
}

export class editCategory {
  constructor(private categoryRepo: CategoryRepository) {}

  async exeute(data: IEditCategoryInput, categorySlug: string) {
    data.slug = slugify(data.slug);

    const foundCategory = await this.categoryRepo.findBySlug(categorySlug);

    if (!foundCategory) {
      throw new AppError("Category not found", 404);
    }

    if (data.parent) {
      validateObjectId(data.parent, "Parent category");
      const existsParentCat = await this.categoryRepo.findById(data.parent);

      if (!existsParentCat || existsParentCat.type === "blog") {
        throw new AppError("Parent Category not found", 404);
      }

      if (existsParentCat._id == data.parent) {
        throw new AppError("Parent Category not found", 400);
      }
    }
    data.type = data.type.trim().toLowerCase() as "blog" | "course";
    const existsSlug = await this.categoryRepo.findBySlugAndType(
      data.slug,
      data.type
    );

    if (existsSlug?._id != foundCategory._id) {
      throw new AppError("We have already category with this slug", 409);
    }

    const updatedCategory = await this.categoryRepo.findByIdAndUpdate(
      foundCategory._id,
      data
    );

    return {
      category: updatedCategory,
    };
  }
}
