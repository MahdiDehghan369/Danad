import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { uploadFile } from "../../middlewares/multer";
import {
  addSessionToSection,
  changeStatusSection,
  createSession,
  editSection,
  getAllSectionForTeacher,
  getSection,
  getSessions,
  removeSection,
  removeSessionFromSection,
} from "./section.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import {
  createSessionSchema,
  editSectionSchema,
  sectionFilterSchema,
  sectionIdValidator,
  sectionStatusSchema,
  sessionFilterSchema,
} from "./section.validator";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { queryValidator } from "../../middlewares/queryValidator";
import { sessionIdValidator } from "../session/session.validator";
const router = Router();

router
  .route("/")
  .get(
    authMiddleware,
    checkRole("teacher"),
    queryValidator(sectionFilterSchema),
    getAllSectionForTeacher
  );

router
  .route("/:sectionId")
  .put(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    bodyValidator(editSectionSchema),
    editSection
  )
  .delete(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    removeSection
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

router
  .route("/:sectionId")
  .get(authMiddleware, paramValidator(sectionIdValidator), getSection);

router
  .route("/:sectionId/status")
  .patch(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    bodyValidator(sectionStatusSchema),
    changeStatusSection
  );

router
  .route("/:sectionId/sessions/:sessionId")
  .post(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    paramValidator(sessionIdValidator),
    addSessionToSection
  )
  .delete(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sectionIdValidator),
    paramValidator(sessionIdValidator),
    removeSessionFromSection
  );

export default router;
