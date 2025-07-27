import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  getUserInfo,
  getUsers,
  removeUser,
  updateUserInfo,
  banUser,
} from "../controllers/user.ctrl";
import { isAdminMiddleware } from "../middlewares/isAdmin";
const router: Router = Router()

router.route("/").get(authMiddleware , isAdminMiddleware , getUsers)
router.route("/edit").put(authMiddleware , updateUserInfo)
router.route("/:userId").delete(authMiddleware , isAdminMiddleware , removeUser).get(authMiddleware , isAdminMiddleware , getUserInfo)

router.route("/:userId/ban").post(authMiddleware , isAdminMiddleware , banUser)

export default router