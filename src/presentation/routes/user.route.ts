import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { updateUserInfo } from "../controllers/user.ctrl";
const router: Router = Router()

router.route("/edit").put(authMiddleware , updateUserInfo)

export default router