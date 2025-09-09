import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { deposit, getTransactions, getWalletBalance } from "./wallet.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { depositSchema } from "./wallet.validator";

const router = Router()

router
  .route("/deposit")
  .post(authMiddleware, bodyValidator(depositSchema), deposit);

router.route("/transactions").get(authMiddleware , getTransactions)

router.route("/balance").get(authMiddleware , getWalletBalance)

export default router