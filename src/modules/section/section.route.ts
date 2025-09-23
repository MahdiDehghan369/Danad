import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import {uploadFile} from "../../middlewares/multer"
import { createSession, getSessions } from "./section.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import { createSessionSchema, sectionIdValidator, sessionFilterSchema } from "./section.validator";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { queryValidator } from "../../middlewares/queryValidator";
const router = Router()

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


export default router