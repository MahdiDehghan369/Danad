import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { couponIdValidator, createCouponSchema, editCouponSchema } from "./coupon.validator";
import { changeStatusCoupon, createCoupon, editCoupon, getCoupon, getCoupons, removeCoupon } from "./coupon.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";

const router = Router()

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(createCouponSchema),
    createCoupon
  ).get(authMiddleware , checkRole("admin") , getCoupons)

router
  .route("/:couponId")
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(couponIdValidator),
    removeCoupon
  )
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(couponIdValidator),
    changeStatusCoupon
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(couponIdValidator),
    getCoupon
  )
  .put(
    authMiddleware,
    checkRole("admin"),
    paramValidator(couponIdValidator),
    bodyValidator(editCouponSchema),
    editCoupon
  );

export default router