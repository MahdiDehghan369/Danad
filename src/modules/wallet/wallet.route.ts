import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { deposit, getTransactions, getWalletBalance, giftDeposit } from "./wallet.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { depositSchema } from "./wallet.validator";
import { checkRole } from "../../middlewares/checkRole";
import { paramValidator } from "../../middlewares/paramValidator";
import { userIdValidator } from "../user/user.validator";

const router = Router()

router
  .route("/deposit")
  .post(authMiddleware, bodyValidator(depositSchema), deposit);

router.route("/transactions").get(authMiddleware , getTransactions)

router.route("/balance").get(authMiddleware , getWalletBalance)

router.route("/:userId/gift").post(authMiddleware , checkRole("admin") , paramValidator(userIdValidator) , bodyValidator(depositSchema) , giftDeposit)

export default router