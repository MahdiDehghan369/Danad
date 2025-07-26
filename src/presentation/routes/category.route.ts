import { Router } from "express";

const router : Router = Router()

import {isAdminMiddleware } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth";
import { createCat } from "../controllers/category.ctrl";


router.route("/").post(authMiddleware, isAdminMiddleware, createCat);



export default router