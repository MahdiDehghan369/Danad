import { Request, Response, NextFunction } from "express";
import { CategoryRepository } from "../../infrastructure/db/mongodb/repositories/categoryRepository";
import { createCategory } from "../../application/usecases/category/createCategory";
import { deleteCategory } from "../../application/usecases/category/deleteCategory";

export const createCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryRepo = new CategoryRepository();
    const categoryUseCase = new createCategory(categoryRepo);
    const data = await categoryUseCase.execute(req?.body);

    return res.status(201).json({
      success: true,
      message: "Category created",
      data: {
        category: data.category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categorySlug } = req.params;
    const { mode } = req.query;

    if (!mode) {
      return res.status(422).json({
        success: false,
        message: "mode must be either 'cascade' or 'detach'",
      });
    }

    const categoryRepo = new CategoryRepository();
    const deleteCatUseCase = new deleteCategory(categoryRepo);

    const data = deleteCatUseCase.execute(
      categorySlug,
      mode as "cascade" | "detach"
    );

    return res.status(200).json({
      success: true,
      message: "Removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
