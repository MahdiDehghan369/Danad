import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import {
  changeStatus,
  createCategory,
  editCategory,
  getCategoriesTree,
  getCategory,
  removeCategory,
} from "./category.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { categoryIdValidator, categorySchema } from "./category.validator";
import { paramValidator } from "../../middlewares/paramValidator";
const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(categorySchema),
    createCategory
  ).get(authMiddleware , checkRole("admin") , getCategoriesTree)



router
  .route("/:categoryId")
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(categoryIdValidator),
    getCategory
  )
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(categoryIdValidator),
    removeCategory
  )
  .put(
    authMiddleware,
    checkRole("admin"),
    paramValidator(categoryIdValidator),
    editCategory
  )
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(categoryIdValidator),
    changeStatus
  );

export default router;
