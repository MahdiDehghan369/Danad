import { AppError } from "../../utils/appError";
import { checkCircularReference } from "../../utils/checkCircularReference";
import { slugify } from "../../utils/slugify";
import { ICategory } from "./category.model";
import {
  categoryRepo,
  ICategoryData,
  IEditCategoryData,
} from "./category.repo";

export const createCategoryService = async (data: ICategoryData) => {
  data.slug = slugify(data.slug);
  const category = await categoryRepo.findOneBySlug(data.slug, data.type);

  if (category) throw new AppError("A category exists with this slug :(", 409);

  if (data.parent) {
    const parentCategory = await categoryRepo.findById(data.parent.toString());
    if (!parentCategory) throw new AppError("Parent category not found", 404);

    if (parentCategory.type === "blog")
      throw new AppError("Parent category not found", 404);

    if (parentCategory.status === "inactive")
      throw new AppError("Parent category not found", 404);
  }

  const result = await categoryRepo.create(data);
  return result;
};

export const getCategoryService = async (categoryId: string) => {
  const category = await categoryRepo.findById(categoryId);

  if (!category) throw new AppError("Category Not Found", 404);

  return category;
};

export const removeCategoryService = async (categoryId: string) => {
  const result = await categoryRepo.removeById(categoryId);

  if (!result) throw new AppError("Category not found", 404);

  return result;
};

export const editCategoryService = async (
  categoryId: string,
  data: IEditCategoryData
) => {
  const category = await categoryRepo.findById(categoryId);

  if (!category) throw new AppError("Category not found", 404);

  data.slug = slugify(data.slug);

  const slugExists = await categoryRepo.findOneBySlug(data.slug, data.type);


  if (slugExists && !slugExists?._id.equals(category._id)) {
    throw new AppError("There already exists a category with this slug", 409);
  }

  if (data.parent) {

    if(data.parent.toString() === categoryId.toString()) throw new AppError("A category cannot be its own parent", 400);

    const parentCategory = await categoryRepo.findById(data.parent.toString());
    if (!parentCategory) throw new AppError("Parent category not found", 404);

    if (parentCategory.type === "blog")
      throw new AppError("Parent category not found", 404);

    if (parentCategory.status === "inactive")
      throw new AppError("Parent category not found", 404);

    const isCircular = await checkCircularReference(
      data.parent.toString(),
      categoryId
    );
    
    if (isCircular) {
      throw new AppError("Invalid parent: circular reference detected", 400);
    }
  }

  const result = await categoryRepo.updateCategoryById(categoryId, data);

  return result as ICategory;
};
