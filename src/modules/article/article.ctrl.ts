import { NextFunction, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { changeStatusArticleService, createArticleService, editArticleService, getAllArticlesForAdminService, getAllArticlesService, getArticleService, getRelatedArticlesService, removeArticleCoverService, removeArticleService, uploadArticleCoverService } from "./article.service";
import { successResponse } from "../../utils/response";
import fs, { stat } from "fs";
import path from "path";
import { articleRepo } from "./article.repo";
import { AppError } from "../../utils/appError";

export const createArticle = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = req.user?._id as string;

    const data = req.body;
    data.author = author;

    const cover = `/article-cover/${req.file?.filename}`;
    data.cover = cover;

    const result = await createArticleService(data);

    return successResponse(res, 200, "Article created successfully", result);
  } catch (error) {
    if (req.file?.filename) {
      fs.unlinkSync(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "article-cover",
          req.file?.filename
        )
      );
    }
    next(error);
  }
};

export const editArticle = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.articleId;
    const data = req.body;

    const cover = req.file?.filename;
    data.cover = cover;

    const result = await editArticleService(articleId, data);

    return successResponse(res, 200, "Article created successfully", result);
  } catch (error) {
    if (req.file?.filename) {
      fs.unlinkSync(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "article-cover",
          req.file?.filename
        )
      );
    }
    next(error);
  }
};

export const removeArticle = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const articleId = req.params.articleId

    await removeArticleService(articleId)

    return successResponse(res, 200 , "Article removed successfully")
    
  } catch (error) {
    next(error)
  }
}

export const getArticle = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const articleSlug = req.params.articleSlug

    const result = await getArticleService(articleSlug);

    return successResponse(res, 200 , "Get article successfully", result)
    
  } catch (error) {
    next(error)
  }
}

export const changeStatusArticle = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const articleId = req.params.articleId

    const result = await changeStatusArticleService(articleId , req.body.status)

    return successResponse(res, 200 , "Status article changed successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const removeArticleCover = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const articleId = req.params.articleId

    const result = await removeArticleCoverService(articleId)

    return successResponse(res, 200 , "Article cover removed successfully")
    
  } catch (error) {
    next(error)
  }
}

export const uploadArticleCover = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const articleId = req.params.articleId
    const cover = req.file?.filename

    if (!cover) throw new AppError("Cover must be upload", 422);

    const result = await uploadArticleCoverService(articleId , cover)

    return successResponse(res, 200 , "Article cover uploaded successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getAllArticles = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const result = await getAllArticlesService(req.query)

    return successResponse(res, 200 , "Get all articles successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getAllArticlesForAdmin = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const result = await getAllArticlesForAdminService(req.query)

    return successResponse(res, 200 , "Get all articles successfully" , result)
    
  } catch (error) {
    next(error)
  }
}

export const getRelatedArticles = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const artileId = req.params.articleId
    const limit = req.body?.limit

    const result = await getRelatedArticlesService(artileId , limit)

    return successResponse(res, 200 , "Get successfully" , result)
    
  } catch (error) {
    next(error)
  }
}