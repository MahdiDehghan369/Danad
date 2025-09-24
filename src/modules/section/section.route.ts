import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import {uploadFile} from "../../middlewares/multer"
import { changeStatusSection, createSession, editSection, getSection, getSessions } from "./section.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import { createSessionSchema, editSectionSchema, sectionIdValidator, sectionStatusSchema, sessionFilterSchema } from "./section.validator";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { queryValidator } from "../../middlewares/queryValidator";
const router = Router()

router
  .route("/:sectionId")
  .put(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    bodyValidator(editSectionSchema),
    editSection
  );

router
  .route("/:sectionId/sessions")
  .post(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    bodyValidator(createSessionSchema),
    uploadFile.fields([
      { name: "session-video", maxCount: 1 },
      { name: "session-file", maxCount: 1 },
    ]),
    createSession
  )
  .get(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    queryValidator(sessionFilterSchema),
    getSessions
  );


router.route("/:sectionId").get(authMiddleware , paramValidator(sectionIdValidator) , getSection)

router
  .route("/:sectionId/status")
  .patch(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    bodyValidator(sectionStatusSchema),
    changeStatusSection
  );


export default router