import path from "path";
import { AppError } from "../../utils/appError";
import { slugify } from "../../utils/slugify";
import { categoryRepo } from "../category/category.repo";
import { courseRepo } from "../course/course.repo";
import { articleRepo, ICreateArticle, IEditArticle } from "./article.repo";
import fs from "fs";

export const createArticleService = async (data: ICreateArticle) => {

  if (data.cover === "/article-cover/undefined") throw new AppError("Cover must be upload" , 422)

  data.slug = slugify(data.slug);
  const articleExisting = await articleRepo.findOne({ slug: data.slug });
  if (articleExisting) throw new AppError("Slug already exists", 404);

  if (data.status === "published") {
    data.publishedAt = new Date();
  }

  if (data.relatedCourses && data.relatedCourses.length > 0) {
    const courses = await courseRepo.find({
      _id: { $in: data.relatedCourses },
    });
    if (courses.length !== data.relatedCourses.length) {
      throw new AppError("One or more related courses not found", 404);
    }
  }

  const category = await categoryRepo.findById(data.category);
  if (!category) throw new AppError("Category not found", 404);
  if (category.type === "course") {
    throw new AppError("Articles cannot be assigned to course category", 400);
  }

  const newArticle = await articleRepo.create(data);

  return { article: newArticle };
};

export const editArticleService = async (
  articleId: string,
  data: IEditArticle
) => {
  const article = await articleRepo.findOne({ _id: articleId });

  if (!article) throw new AppError("Article not found", 404);

  data.slug = slugify(data.slug);
  const slugExisting = await articleRepo.findOne({
    _id: { $ne: articleId },
    slug: data.slug,
  });

  if (slugExisting) throw new AppError("Slug already exists", 409);

  if (data.relatedCourses && data.relatedCourses.length > 0) {
    const courses = await courseRepo.find({
      _id: { $in: data.relatedCourses },
    });
    if (courses.length !== data.relatedCourses.length) {
      throw new AppError("One or more related courses not found", 404);
    }
  }

  
  const category = await categoryRepo.findById(data.category);
  if (!category) throw new AppError("Category not found", 404);

  if (article.status === "draft" && data.status === "published") {
    data.publishedAt = new Date();
  } else if (article.status === "published" && data.status === "draft") {
    data.publishedAt = null;
  }

  if (data.cover) {
    if (article.cover) {
      const oldCoverPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        article.cover
      );
      if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
    }

    data.cover = `/article-cover/${data.cover}`;
  }

  const updatedArticle = await articleRepo.findOneAndUpdate(
    { _id: articleId },
    data
  );

  return { article: updatedArticle };
};

export const removeArticleService = async (articleId: string) => {
  const article = await articleRepo.findOne({_id: articleId})

  if(!article) throw new AppError("Article not found" , 404)

  if(article.cover){
    const coverPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      article.cover
    );

    if(fs.existsSync(coverPath)) fs.unlinkSync(coverPath)
  }

  await articleRepo.deleteOne({_id: articleId})
}

export const getArticleService = async (articleSlug: string) => {
  articleSlug = slugify(articleSlug)
  const article = await articleRepo.findOneAndUpdate(
    { slug: articleSlug },
    { $inc: { views: 1 } }
  );

  return {article}
}

export const changeStatusArticleService = async (
  articleId: string,
  status: "published" | "draft"
) => {
  const article = await articleRepo.findOne({ _id: articleId });

  if (!article) throw new AppError("Article not found", 404);

  let publishedAt = article.publishedAt;
  if (article.status === "draft" && status === "published") {
    publishedAt = new Date();
  } else if(article.status === "published" && status === "draft"){
    publishedAt = null
  }

  const updatedArticle = await articleRepo.findOneAndUpdate(
    { _id: articleId },
    { status, publishedAt }
  );

  return { article: updatedArticle };
};