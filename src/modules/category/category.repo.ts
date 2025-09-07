import { Types } from "mongoose"
import categoryModel ,{ICategory} from "./category.model"
import { UpdateResult } from "mongoose";

export interface ICategoryData {
    title: string,
    slug: string,
    description: string,
    type: "blog" | "course",
    createdBy: Types.ObjectId,
    status?: "active" | "inactive"
    parent?: Types.ObjectId | null
}

export interface IEditCategoryData {
  title: string;
  slug: string;
  description: string;
  type: "active" | "inactive";
  status: "active" | "inactive",
  parent: Types.ObjectId | null
}

export const categoryRepo = {
  create: async (data: ICategoryData): Promise<ICategory> =>
    await categoryModel.create(data),
  findOneBySlug: async (
    slug: string,
    type: string
  ): Promise<ICategory | null> =>
    await categoryModel.findOne({ slug, type }).lean(),
  findById: async (categoryId: string): Promise<ICategory | null> =>
    await categoryModel
      .findById(categoryId, "-__v")
      .populate("createdBy", "name avatar username")
      .populate("parent")
      .lean(),
  removeById: async (categoryId: string): Promise<ICategory | null> =>
    await categoryModel.findByIdAndDelete(categoryId),
  updateCategoryById: async (
    categoryId: string,
    data: IEditCategoryData
  ): Promise<ICategory | null> =>
    await categoryModel.findByIdAndUpdate(categoryId, data, { new: true }),
  updateMany: async (condition: object, set: object): Promise<UpdateResult> =>
    await categoryModel.updateMany(condition, set),
  find: async (condition: object): Promise<ICategory[] | null> =>
    await categoryModel.find(condition),
  updateOne: async (condition: object, set: object): Promise<UpdateResult> =>
    await categoryModel.updateOne(condition, set),
getCategoriesTreeAggregation: async (status?: string) => {
  const matchCondition: any = { parent: null };
  if (status) matchCondition.status = status;

  const categories = await categoryModel.aggregate([
    {
      $graphLookup: {
        from: "categories",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parent",
        as: "children",
        restrictSearchWithMatch: status ? { status } : {}, 
      },
    },
    { $match: matchCondition },
  ]);

  return categories;
}

};