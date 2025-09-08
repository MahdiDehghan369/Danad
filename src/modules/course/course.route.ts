import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { createCourse, editCourse } from "./course.ctrl";
import uploadPhoto from "../../middlewares/multer";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { courseIdValidator, createCourseSchema, updateCourseSchema } from "./course.validator";
import { paramValidator } from "../../middlewares/paramValidator";
const router = Router()

router.route("/").post(
  authMiddleware,
  checkRole("admin"),
  uploadPhoto.single("cover"),
  bodyValidator(createCourseSchema),
  createCourse
);

router.route("/:courseId").put(
  authMiddleware,
  checkRole("admin"),
  uploadPhoto.single("cover"),
  paramValidator(courseIdValidator),
  bodyValidator(updateCourseSchema),
  editCourse
);

export default router