import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { bodyValidator } from "../../middlewares/bodyValidator";
import {
  createDiscountSchema,
  discountIdValidator,
  getDiscountsSchema,
  updateDiscountSchema,
} from "./discount.validator";
import {
  changeStatusDiscount,
  createCourseDiscount,
  getCourseDiscount,
  getCourseDiscounts,
  removeCourseDiscount,
  updateCourseDiscount,
} from "./discount.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import { queryValidator } from "../../middlewares/queryValidator";

const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(createDiscountSchema),
    createCourseDiscount
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    queryValidator(getDiscountsSchema),
    getCourseDiscounts
  );

router
  .route("/:discountId")
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(discountIdValidator),
    removeCourseDiscount
  )
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(discountIdValidator),
    changeStatusDiscount
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(discountIdValidator),
    getCourseDiscount
  )
  .put(
    authMiddleware,
    checkRole("admin"),
    paramValidator(discountIdValidator),
    bodyValidator(updateDiscountSchema),
    updateCourseDiscount
  );

export default router;
