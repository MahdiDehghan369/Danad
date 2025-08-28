import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { createCategory, getCategory } from "./category.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { categoryIdValidator, categorySchema } from "./category.validator";
import { paramValidator } from "../../middlewares/paramValidator";
const router = Router()


router.route("/").post(authMiddleware , checkRole("admin"), bodyValidator(categorySchema) , createCategory)
router
  .route("/:categoryId")
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(categoryIdValidator),
    getCategory
  );

export default router