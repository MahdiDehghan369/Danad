import { Request , Response , NextFunction } from "express"
import { CategoryRepository } from "../../infrastructure/db/mongodb/repositories/categoryRepository"
import { createCategory } from "../../application/usecases/category/createCategory"

export const createCat = async (req: Request, res: Response , next: NextFunction) => {
    try {

        const categoryRepo = new CategoryRepository()
        const categoryUseCase = new createCategory(categoryRepo);
        const data = await categoryUseCase.execute(req?.body)

        return res.status(201).json({
          success: true,
          message: "Category created",
          data: {
            category: data.category,
          },
        });
        
    } catch (error) {
        next(error)
    }
}