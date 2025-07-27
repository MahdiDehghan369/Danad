import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getUserInfo, removeUser, updateUserInfo } from "../controllers/user.ctrl";
import { isAdminMiddleware } from "../middlewares/isAdmin";
const router: Router = Router()

router.route("/edit").put(authMiddleware , updateUserInfo)
router.route("/:userId").delete(authMiddleware , isAdminMiddleware , removeUser).get(authMiddleware , isAdminMiddleware , getUserInfo)

export default router