import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  changeStatusComment,
  createComment,
  dislikeComment,
  getComment,
  getComments,
  likeComment,
  removeComment,
} from "./comment.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import {
  commentFilterSchema,
  commentIdValidator,
  createCommentSchema,
  statusCommentSchema,
} from "./comment.validator";
import { paramValidator } from "../../middlewares/paramValidator";
import { checkRole } from "../../middlewares/checkRole";
import { queryValidator } from "../../middlewares/queryValidator";
const router = Router();

router
  .route("/")
  .post(authMiddleware, bodyValidator(createCommentSchema), createComment)
  .get(
    authMiddleware,
    checkRole(["admin", "teacher"]),
    queryValidator(commentFilterSchema),
    getComments
  );

router
  .route("/:commentId")
  .delete(
    authMiddleware,
    checkRole(["admin", "teacher"]),
    paramValidator(commentIdValidator),
    removeComment
  )
  .get(
    authMiddleware,
    checkRole(["admin", "teacher"]),
    paramValidator(commentIdValidator),
    getComment
  );

router
  .route("/:commentId/like")
  .post(authMiddleware, paramValidator(commentIdValidator), likeComment);

router
  .route("/:commentId/dislike")
  .post(authMiddleware, paramValidator(commentIdValidator), dislikeComment);

router
  .route("/:commentId/status")
  .patch(
    authMiddleware,
    checkRole(["admin", "teacher"]),
    paramValidator(commentIdValidator),
    bodyValidator(statusCommentSchema),
    changeStatusComment
  );

export default router;
