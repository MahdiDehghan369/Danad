import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { deposit, editInventory, getTransactions, getWalletBalance, giftDeposit } from "./wallet.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { depositSchema, editInventorySchema } from "./wallet.validator";
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

router.route("/:userId/change-inventory").put(authMiddleware , checkRole("admin") , paramValidator(userIdValidator) , bodyValidator(editInventorySchema) , editInventory)

export default router