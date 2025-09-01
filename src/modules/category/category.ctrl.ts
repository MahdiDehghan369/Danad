import { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  editCategoryService,
  getCategoryService,
  removeCategoryService,
} from "./category.service";
import { ICategoryData } from "./category.repo";
import { successResponse } from "../../utils/response";
import { ICustomRequest } from "../../middlewares/auth";

export const createCategory = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    req.body.createdBy = userId;

    const result = await createCategoryService(req.body as ICategoryData);

    return successResponse(res, 200, "Category created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    const result = await getCategoryService(categoryId);

    return successResponse(
      res,
      200,
      "Fetch category info successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const removeCategory = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    const result = await removeCategoryService(categoryId);

    return successResponse(res, 200, "Category removed successfully", result);
  } catch (error) {
    next(error);
  }
};

export const editCategory = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    const result = await editCategoryService(categoryId, req.body);

    return successResponse(res, 200, "Category updated successfully", result);
  } catch (error) {
    next(error);
  }
};
