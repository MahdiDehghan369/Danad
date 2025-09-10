import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { getAllTransactions, getTransaction, removeTransaction } from "./transaction.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import { tranIdValidator } from "./transaction.validator";

const router = Router()

router.route("/").get(authMiddleware, checkRole("admin"), getAllTransactions);

router.route("/:tranId").delete(authMiddleware , paramValidator(tranIdValidator),  removeTransaction).get(authMiddleware , paramValidator(tranIdValidator) , getTransaction)

export default router