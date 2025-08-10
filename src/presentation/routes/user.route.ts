import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  getUserInfo,
  getUsers,
  removeUser,
  updateUserInfo,
  banUser,
  unbanUser,
  fetchBannedUsers,
  uploadProfile,
  removeProfile,
} from "../controllers/user.ctrl";
import { isAdminMiddleware } from "../middlewares/isAdmin";

import uploader from "./../../utils/multer"

const router: Router = Router()

router.route("/").get(authMiddleware , isAdminMiddleware , getUsers)
router
  .route("/prof")
  .post(authMiddleware, uploader.single("profile"), uploadProfile).delete(authMiddleware , removeProfile);
router.route("/edit").put(authMiddleware , updateUserInfo)
router.route("/ban").post(authMiddleware, isAdminMiddleware, banUser).get(authMiddleware , isAdminMiddleware , fetchBannedUsers);
router.route("/unban").delete(authMiddleware, isAdminMiddleware, unbanUser);
router.route("/:userId").delete(authMiddleware , isAdminMiddleware , removeUser).get(authMiddleware , isAdminMiddleware , getUserInfo)


export default router