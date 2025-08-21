import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { changePassword } from "./user.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { changePasswordValidator } from "./user.validator";

const router = Router()

router
  .route("/change-password")
  .patch(
    authMiddleware,
    bodyValidator(changePasswordValidator),
    changePassword
  );

export default router