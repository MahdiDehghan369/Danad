import { ICategoryRepository } from "../../../../application/interfaces/ICategoryRepository";
import { Category } from "../../../../domain/entities/category";
import { buildCategoryTree } from "../../../../utils/buildCategoryTree";
import { categoryModel } from "../models/category.model";

interface GetCategoryOptions {
  type?: "blog" | "course";
  parent?: string | null;
  page?: number;
  limit?: number;
  isActive?: boolean
}

interface ICreateCategory {
  title: string;
  slug: string;
  description: string;
  type: "blog" | "course";
  parent: string | null;
  isActive: boolean;
}

export class CategoryRepository implements ICategoryRepository {
  async save(data: ICreateCategory): Promise<Category | null> {
    const created = await categoryModel.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      type: data.type,
      parent: data.parent || null,
      isActive: data.isActive ?? true,
    });

    return new Category(
      created._id as string,
      created.title,
      created.slug,
      created.description,
      created.type,
      created.parent?.toString() || null,
      created.isActive,
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(categoryId: string): Promise<Category | null> {
    const category = await categoryModel.findById(categoryId, "-__v").lean();

    if (!category) return null;

    return new Category(
      category._id.toString(),
      category.title,
      category.slug,
      category.description,
      category.type,
      category.parent?.toString() || null,
      category.isActive,
      category.createdAt,
      category.updatedAt
    );
  }

  async findByIdAndUpdate(
    categoryId: string,
    data: object
  ): Promise<Category | null> {
    const category = await categoryModel.findByIdAndUpdate(categoryId, data, {
      new: true,
    });

    if (!category) return null;

    return new Category(
      category._id as string,
      category.title,
      category.slug,
      category.description,
      category.type,
      category.parent?.toString() || null,
      category.isActive,
      category.createdAt,
      category.updatedAt
    );
  }

  async getCategories(options: GetCategoryOptions): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { type, parent, page = 1, limit = 10, isActive } = options;

    const filters: any = {};
    if (type) filters.type = type;
    if (parent !== undefined) {
      filters.parent = parent === null ? null : parent;
    }

    if (typeof isActive === "boolean") {
      filters.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      categoryModel.find(filters, "-__v").skip(skip).limit(limit).lean(),
      categoryModel.countDocuments(filters),
    ]);

    const mapped = categories.map(
      (cat) =>
        new Category(
          cat._id.toString(),
          cat.title,
          cat.slug,
          cat.description,
          cat.type,
          cat.parent?.toString() || null,
          cat.isActive ?? false,
          cat.createdAt ?? undefined,
          cat.updatedAt ?? undefined
        )
    );



    const tree = buildCategoryTree(mapped);

    return { data: tree, total, page, limit };
  }

  async findByIdAndDelete(categoryId: string): Promise<boolean> {
    const category = await categoryModel.findByIdAndDelete(categoryId);

    if (!category) return false;

    return true;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await categoryModel.findOne({ slug }, "-__v").lean();

    if (!category) return null;

    return new Category(
      category._id.toString(),
      category.title,
      category.slug,
      category.description,
      category.type,
      category.parent?.toString() || null,
      category.isActive,
      category.createdAt,
      category.updatedAt
    );
  }

  async deleteCategoryCascade(categoryId: string): Promise<void> {
    await categoryModel.deleteMany({ parent: categoryId });
    await categoryModel.findByIdAndDelete(categoryId);
  }

  async deleteCategoryDetach(categoryId: string): Promise<void> {
    await categoryModel.updateMany(
      { parent: categoryId },
      { $set: { parent: null } }
    );
    await categoryModel.findByIdAndDelete(categoryId);
  }

  async findBySlugAndType(
    slug: string,
    type: "blog" | "course"
  ): Promise<Category | null> {
    const category = await categoryModel.findOne({ slug, type }, "-__v").lean();

    if (!category) return null;

    return new Category(
      category._id.toString(),
      category.title,
      category.slug,
      category.description,
      category.type,
      category.parent?.toString() || null,
      category.isActive,
      category.createdAt,
      category.updatedAt
    );
  }
}