import { Router } from "express";
import {
  banUser,
  editBan,
  getBanInfo,
  getBanUsers,
  unbanUser,
} from "./ban.ctrl";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { paramValidator } from "../../middlewares/paramValidator";
import { queryValidator } from "../../middlewares/queryValidator";
import {
  banUserValidator,
  userIdValidator,
  getBanUsersQueryValidator,
  banIdValidator,
  editBanValidator,
} from "./ban.validator";
const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(banUserValidator),
    banUser
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    queryValidator(getBanUsersQueryValidator),
    getBanUsers
  );
router
  .route("/:userId")
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),

    unbanUser
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),
    getBanInfo
  );

router
  .route("/:banId")
  .put(
    authMiddleware,
    checkRole("admin"),
    paramValidator(banIdValidator),
    bodyValidator(editBanValidator),
    editBan
  );

export default router;
