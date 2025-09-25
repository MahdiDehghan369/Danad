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

export const articleRepo = {
  create: async (data: ICreateArticle): Promise<IArticle> => await articleModel.create(data),
  findOne: async(condition: FilterQuery<IArticle>) : Promise<IArticle | null> => await articleModel.findOne(condition).populate("author" , "fullname username email avatar").populate("category" , "-__v"),
  findOneAndUpdate: async (condition: FilterQuery<IArticle> , data: object) => await articleModel.findOneAndUpdate(condition , data , {new: true}),
  deleteOne: async (condition: FilterQuery<IArticle>) : Promise<DeleteResult> => await articleModel.deleteOne(condition)
};
