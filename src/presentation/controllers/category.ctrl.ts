import { Request, Response, NextFunction } from "express";
import { CategoryRepository } from "../../infrastructure/db/mongodb/repositories/categoryRepository";
import { createCategory } from "../../application/usecases/category/createCategory";
import { deleteCategory } from "../../application/usecases/category/deleteCategory";
import { editCategory } from "../../application/usecases/category/editCategory";
import { getCategoryInfo } from "../../application/usecases/category/getCategoryInfo";
import { getAllCategories } from "../../application/usecases/category/getAllCategories";
import { toggleCategoryStatus } from "../../application/usecases/category/toggleCategoryStatus";

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

export const editCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categorySlug } = req.params;
    const categoryRepo = new CategoryRepository();
    const editCategoryUseCase = new editCategory(categoryRepo);
    const data = await editCategoryUseCase.exeute(req?.body, categorySlug);

    return res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category: data.category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleCategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categorySlug } = req.params;
    const categoryRepo = new CategoryRepository();
    const getCategoryInfoUseCase = new getCategoryInfo(categoryRepo);

    const data = await getCategoryInfoUseCase.execute(categorySlug);

    return res.status(201).json({
      success: true,
      data: {
        category: data.category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request , res: Response , next: NextFunction) => {
    try {
    
        const option = req.query
        const categoryRepo = new CategoryRepository()
        const getAllCategoriesUseCase = new getAllCategories(categoryRepo)
        const data = await getAllCategoriesUseCase.execute(option)

        return res.status(200).json({
            success: true,
            data: {
                categories: data.categories
            }
        })
        
    } catch (error) {
        next(error)
    }
}

export const toggleCatStatus = async (req: Request , res: Response , next: NextFunction) => {
    try {
        const { categorySlug } = req.params
        const categoryRepo = new CategoryRepository()
        const toggleCategoryStatusUseCase = new toggleCategoryStatus(categoryRepo)

        const data = await toggleCategoryStatusUseCase.execute(categorySlug);

        return res.status(201).json({
            success: true,
            data: {
                category: data.category
            }
        })

    } catch (error) {
        next(error)
    }
}