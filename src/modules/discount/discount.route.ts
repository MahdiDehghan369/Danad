import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { createDiscountSchema } from "./discount.validator";
import { createCourseDiscount } from "./discount.ctrl";

const router = Router()

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(createDiscountSchema),
    createCourseDiscount
  );

export default router