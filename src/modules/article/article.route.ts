import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { uploadPhoto } from "../../middlewares/multer";
import { changeStatusArticle, createArticle, editArticle, getArticle, removeArticle } from "./article.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import { articleIdValidator, articleStatusSchema, createArticleSchema, editArticleSchema } from "./article.validator";
import { paramValidator } from "../../middlewares/paramValidator";

const router = Router()

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    uploadPhoto.single("article-cover"),
    bodyValidator(createArticleSchema),
    createArticle
  );

router
  .route("/:articleId")
  .put(
    authMiddleware,
    checkRole("admin"),
    paramValidator(articleIdValidator),
    uploadPhoto.single("article-cover"),
    bodyValidator(editArticleSchema),
    editArticle
  )
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(articleIdValidator),
    removeArticle
  )

router.route("/:articleSlug").get(getArticle)

router
  .route("/:articleId/status")
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(articleIdValidator),
    bodyValidator(articleStatusSchema),
    changeStatusArticle
  );

export default router