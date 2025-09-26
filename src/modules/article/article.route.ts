import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";
import { uploadPhoto } from "../../middlewares/multer";
import {
  changeStatusArticle,
  createArticle,
  editArticle,
  getAllArticles,
  getAllArticlesForAdmin,
  getArticle,
  getRelatedArticles,
  removeArticle,
  removeArticleCover,
  uploadArticleCover,
} from "./article.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import {
  articleFilterSchema,
  articleIdValidator,
  articleLimitSchema,
  articleStatusSchema,
  createArticleSchema,
  editArticleSchema,
} from "./article.validator";
import { paramValidator } from "../../middlewares/paramValidator";
import { queryValidator } from "../../middlewares/queryValidator";

const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    checkRole("admin"),
    uploadPhoto.single("article-cover"),
    bodyValidator(createArticleSchema),
    createArticle
  )
  .get(queryValidator(articleFilterSchema), getAllArticles);

router
  .route("/admin")
  .get(
    authMiddleware,
    checkRole("admin"),
    queryValidator(articleFilterSchema),
    getAllArticlesForAdmin
  );

  router
    .route("/:articleId/related")
    .get(
      paramValidator(articleIdValidator),
      bodyValidator(articleLimitSchema),
      getRelatedArticles
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
  );

router.route("/:articleSlug").get(getArticle);

router
  .route("/:articleId/status")
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(articleIdValidator),
    bodyValidator(articleStatusSchema),
    changeStatusArticle
  );

router
  .route("/:articleId/cover")
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(articleIdValidator),
    removeArticleCover
  )
  .post(
    authMiddleware,
    checkRole("admin"),
    paramValidator(articleIdValidator),
    uploadPhoto.single("article-cover"),
    uploadArticleCover
  );

export default router;
