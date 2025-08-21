import { Router } from "express";
import { banUser } from "./ban.ctrl";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";

const router = Router()

router.route("/").post(authMiddleware , checkRole("admin") , banUser)

export default router