import { DeleteResult, FilterQuery } from "mongoose";
import articleModel, { ArticleStatus, IArticle } from "./article.model";

export interface ICreateArticle {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  cover: string;
  author: string;
  relatedCourses?: string[];
  category: string;
  status: ArticleStatus;
  publishedAt?: Date;
}

export interface IEditArticle {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  cover?: string;
  relatedCourses?: string[];
  category: string;
  status: ArticleStatus;
  publishedAt?: Date | null;
}

export interface IArticleFilter {
  sortBy?: "newest" | "oldest" | "popular" | "all";
  page?: number;
  limit?: number;
  condition?: object;
  status?: "published" | "draft";
  categories?: string[];
}

export const articleRepo = {
  create: async (data: ICreateArticle): Promise<IArticle> =>
    await articleModel.create(data),
  findOne: async (condition: FilterQuery<IArticle>): Promise<IArticle | null> =>
    await articleModel
      .findOne(condition)
      .populate("author", "fullname username email avatar")
      .populate("category", "-__v"),
  findOneAndUpdate: async (condition: FilterQuery<IArticle>, data: object) =>
    await articleModel.findOneAndUpdate(condition, data, { new: true }),
  deleteOne: async (condition: FilterQuery<IArticle>): Promise<DeleteResult> =>
    await articleModel.deleteOne(condition),
  findAllArticles: async (filter: IArticleFilter = {}) => {
    const query: any = {};

    if (filter.categories && filter.categories.length > 0)
      query.category = { $in: filter.categories };

    if (filter.status) query.status = filter.status;

    if (filter.condition) {
      Object.assign(query, filter.condition);
    }

    const sortOptions: Record<string, any> = {
      newest: { publishedAt: -1 },
      oldest: { publishedAt: 1 },
      popular: { views: -1 },
      all: { publishedAt: -1 },
    };
    const sort = sortOptions[filter.sortBy || "all"];

    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      articleModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("author", "fullname username email avatar")
        .populate("relatedCourses", "title cover"),
      articleModel.countDocuments(query),
    ]);

    return {
      articles: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  findRelatedArticles: async (filter: FilterQuery<IArticle>, limit: number) =>
    await articleModel
      .find(filter)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select("title slug cover shortDescription publishedAt views"),
};
