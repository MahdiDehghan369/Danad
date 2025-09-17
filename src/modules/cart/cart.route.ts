import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { addItemToCart, applyCoupon, checkout, getCart, removeCouponCart, removeItem } from "./cart.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import { applyCouponSchema, cartIdValidator, itemIdValidator } from "./cart.validator";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { courseIdValidator } from "../course/course.validator";

const router = Router()

router.route("/").get(authMiddleware , getCart)

router
  .route("/items")
  .post(authMiddleware, bodyValidator(courseIdValidator) ,addItemToCart);

router
  .route("/items/:itemId")
  .delete(authMiddleware, paramValidator(itemIdValidator) , removeItem);

router
  .route("/coupon")
  .post(authMiddleware, bodyValidator(applyCouponSchema), applyCoupon)
  .delete(authMiddleware, removeCouponCart);

router.route("/checkout").post(authMiddleware , checkout)

export default router