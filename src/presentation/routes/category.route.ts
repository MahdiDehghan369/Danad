import { Router } from "express";

const router : Router = Router()

import {isAdminMiddleware } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth";
import {
  createCat,
  deleteCat,
  editCat,
  getSingleCategoryInfo,
  getCategories,
  toggleCatStatus,
} from "../controllers/category.ctrl";


router
  .route("/")
  .post(authMiddleware, isAdminMiddleware, createCat)
  .get(authMiddleware, isAdminMiddleware, getCategories);
router
  .route("/:categorySlug")
  .delete(authMiddleware, isAdminMiddleware, deleteCat)
  .put(authMiddleware, isAdminMiddleware, editCat).get(authMiddleware , isAdminMiddleware , getSingleCategoryInfo)

router
  .route("/:categorySlug/change-status")
  .patch(authMiddleware, isAdminMiddleware, toggleCatStatus);

export default router