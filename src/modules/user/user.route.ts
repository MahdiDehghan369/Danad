import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { changePassword, changeUserRole, editUserInfo, getUserInfo, removeUser } from "./user.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { changePasswordValidator, editUserInfoValidator, userIdValidator, userRoleValidator } from "./user.validator";
import { checkRole } from "../../middlewares/checkRole";
import { paramValidator } from "../../middlewares/paramValidator";

const router = Router()

router
  .route("/change-password")
  .patch(
    authMiddleware,
    bodyValidator(changePasswordValidator),
    changePassword
  );

router
  .route("/")
  .put(authMiddleware, bodyValidator(editUserInfoValidator), editUserInfo);

router
  .route("/:userId")
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),
    removeUser
  )
  .get(authMiddleware, checkRole("admin"), paramValidator(userIdValidator) , getUserInfo);

router
  .route("/:userId/change-role")
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),
    bodyValidator(userRoleValidator),
    changeUserRole
  );

export default router