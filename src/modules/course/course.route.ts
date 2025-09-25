import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { changeStatusCourse, changeTeacherCourse, createCourse, createSection, editCourse, getAllSectionsOfCourse, getAllSessionOfCourse, getCourse, getCourses, getCoursesForAdmin, removeCourse, removeCourseCover } from "./course.ctrl";
import {uploadPhoto} from "../../middlewares/multer";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { courseFilterAdminSchema, courseFilterSchema, courseIdValidator, createCourseSchema, createSectionSchema, statusCourse, teacherIdValidator, updateCourseSchema } from "./course.validator";
import { paramValidator } from "../../middlewares/paramValidator";
import { optionalAuthMiddleware } from "../../middlewares/optionalAuthMiddleware";
import { queryValidator } from "../../middlewares/queryValidator";
const router = Router()

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    uploadPhoto.single("cover"),
    bodyValidator(createCourseSchema),
    createCourse
  )
  .get(queryValidator(courseFilterSchema), getCourses);

  router
    .route("/get-courses-admin")
    .get(
      authMiddleware,
      checkRole("admin"),
      queryValidator(courseFilterAdminSchema),
      getCoursesForAdmin
    );


router.route("/:courseSlug").get(optionalAuthMiddleware, getCourse);

router
  .route("/:courseId/sections")
  .get(
    optionalAuthMiddleware,
    getAllSectionsOfCourse
  );

router.route("/:courseId").put(
  authMiddleware,
  checkRole("admin"),
  uploadPhoto.single("cover"),
  paramValidator(courseIdValidator),
  bodyValidator(updateCourseSchema),
  editCourse
).delete(authMiddleware , checkRole("admin") , paramValidator(courseIdValidator) , removeCourse);

router.route("/:courseId/status").patch(authMiddleware , checkRole("admin") , paramValidator(courseIdValidator) , bodyValidator(statusCourse) , changeStatusCourse)

router.route("/:courseId/teacher").patch(authMiddleware , checkRole("admin") , paramValidator(courseIdValidator) , bodyValidator(teacherIdValidator) , changeTeacherCourse)

router.route("/:courseId/cover").delete(authMiddleware , checkRole("admin") , paramValidator(courseIdValidator) , removeCourseCover)

router
  .route("/:courseId/sections")
  .post(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(courseIdValidator),
    bodyValidator(createSectionSchema),
    createSection
  );

router
  .route("/:courseId/sessions")
  .get(paramValidator(courseIdValidator), getAllSessionOfCourse);

export default router