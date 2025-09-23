import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { paramValidator } from "../../middlewares/paramValidator";
import { sessionFreeSchema, sessionIdValidator, sessionStatusSchema } from "./session.validator";
import { changeFreeSession, changeStatusSession, getSession, removeSession } from "./session.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";

const router = Router()

router
  .route("/:sessionId")
  .get(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sessionIdValidator),
    getSession
  ).delete(authMiddleware , checkRole("teacher") , paramValidator(sessionIdValidator) , removeSession)


router
  .route("/:sessionId/status")
  .patch(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sessionIdValidator),
    bodyValidator(sessionStatusSchema),
    changeStatusSession
  );

router
  .route("/:sessionId/free")
  .patch(
    authMiddleware,
    checkRole("teacher"),
    paramValidator(sessionIdValidator),
    bodyValidator(sessionFreeSchema),
    changeFreeSession
  );

export default router