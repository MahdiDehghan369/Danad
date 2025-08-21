import { Router } from "express";
import { banUser, getBanInfo, unbanUser } from "./ban.ctrl";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { paramValidator } from "../../middlewares/paramValidator";
import { banUserValidator, userIdValidator } from "./ban.validator";
const router = Router();

router
  .route("/")
  .post(
    bodyValidator(banUserValidator),
    authMiddleware,
    checkRole("admin"),
    banUser
  );
router
  .route("/:userId")
  .delete(
    paramValidator(userIdValidator),
    authMiddleware,
    checkRole("admin"),
    unbanUser
  )
  .get(
    paramValidator(userIdValidator),
    authMiddleware,
    checkRole("admin"),
    getBanInfo
  );

export default router;
