import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import {
  changeStatusDepartment,
  createDepartment,
  editDepartment,
  getAllDepartment,
  getDepartment,
  getDepartmentsAdmin,
  removeDepartment,
} from "./department.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import {
  createDepartmentSchema,
  departmentIdValidator,
  editDepartmentSchema,
  querySchema,
} from "./department.validator";
import { paramValidator } from "../../middlewares/paramValidator";
import { queryValidator } from "../../middlewares/queryValidator";
const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    bodyValidator(createDepartmentSchema),
    createDepartment
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    queryValidator(querySchema),
    getDepartmentsAdmin
  );

  router.route("/ticket").get(authMiddleware, getAllDepartment);

router
  .route("/:departmentId")
  .put(
    authMiddleware,
    checkRole("admin"),
    paramValidator(departmentIdValidator),
    bodyValidator(editDepartmentSchema),
    editDepartment
  )
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(departmentIdValidator),
    removeDepartment
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(departmentIdValidator),
    getDepartment
  )
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(departmentIdValidator),
    changeStatusDepartment
  );



export default router;
