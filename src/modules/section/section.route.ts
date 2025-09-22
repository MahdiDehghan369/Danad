import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import {uploadFile} from "../../middlewares/multer"
import { createSession } from "./section.ctrl";
import { paramValidator } from "../../middlewares/paramValidator";
import { createSessionSchema, sectionIdValidator } from "./section.validator";
import { bodyValidator } from "../../middlewares/bodyValidator";
const router = Router()

router.route("/:sectionId/sessions").post(
  authMiddleware,
  checkRole("teacher"),
  paramValidator(sectionIdValidator),
  bodyValidator(createSessionSchema),
  uploadFile.fields([
    { name: "session-video", maxCount: 1 },
    { name: "session-file", maxCount: 1 },
  ]),
  createSession
);

export default router