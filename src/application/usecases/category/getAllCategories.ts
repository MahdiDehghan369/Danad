import { CategoryRepository } from "../../../infrastructure/db/mongodb/repositories/categoryRepository";

interface GetCategoryOptions {
  type?: "blog" | "course";
  parent?: string | null;
  page?: number;
  limit?: number;
}

export class getAllCategories {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(options: GetCategoryOptions) {
    const categories = await this.categoryRepo.getCategories(options)

    return {
        categories
    }
  }
}