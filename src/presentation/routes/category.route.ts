import { Router } from "express";

const router : Router = Router()

import {isAdminMiddleware } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth";
import { createCat, deleteCat } from "../controllers/category.ctrl";


router.route("/").post(authMiddleware, isAdminMiddleware, createCat);
router
  .route("/:categorySlug")
  .delete(authMiddleware, isAdminMiddleware, deleteCat);

export default router