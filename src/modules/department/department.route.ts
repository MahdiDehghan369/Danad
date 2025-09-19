import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { createDepartment } from "./department.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { createDepartmentSchema } from "./department.validator";
const router = Router()

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(createDepartmentSchema),
    createDepartment
  );

export default router