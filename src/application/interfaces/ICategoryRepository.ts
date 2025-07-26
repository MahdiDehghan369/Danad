import { Category } from "../../domain/entities/category"

interface GetCategoryOptions {
  type?: "blog" | "course";
  parent?: string | null;
  page?: number;
  limit?: number;
}

interface ICreateCategory {
  title: string;
  slug: string;
  description: string;
  type: "blog" | "course";
  parent: string | null;
  isActive: boolean;
}

export interface ICategoryRepository {
  save(data: ICreateCategory): Promise<Category | null>;
  findById(categoryId: string): Promise<Category | null>;
  getCategories(options: GetCategoryOptions): Promise<{
    data: Category[];
    total: number;
    page: number;
    limit: number;
  }>;
  findByIdAndDelete(categoryId: string): Promise<boolean>;
  findBySlug(slug: string): Promise<Category | null>;
} 