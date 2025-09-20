import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  changePassword,
  changeUserRole,
  editUserInfo,
  getActiveAccounts,
  getUserCourses,
  getUserInfo,
  getUsers,
  getUserTickets,
  removeAcount,
  removeAllAccounts,
  removeProfile,
  removeUser,
  setProfile,
} from "./user.ctrl";
import { bodyValidator } from "../../middlewares/bodyValidator";
import {
  accountIdValidator,
  changePasswordValidator,
  editUserInfoValidator,
  getUsersQueryValidator,
  queryFindTicketsSchema,
  userIdValidator,
  userRoleValidator,
} from "./user.validator";
import { checkRole } from "../../middlewares/checkRole";
import { paramValidator } from "../../middlewares/paramValidator";
import { queryValidator } from "../../middlewares/queryValidator";
import uploadPhoto from "../../middlewares/multer";

const router = Router();

router
  .route("/change-password")
  .patch(
    authMiddleware,
    bodyValidator(changePasswordValidator),
    changePassword
  );

router
  .route("/")
  .put(authMiddleware, bodyValidator(editUserInfoValidator), editUserInfo)
  .get(
    authMiddleware,
    checkRole("admin"),
    queryValidator(getUsersQueryValidator),
    getUsers
  );

router
  .route("/profile")
  .post(authMiddleware, uploadPhoto.single("profile"), setProfile)
  .delete(authMiddleware, removeProfile);

router.route("/accounts").get(authMiddleware, getActiveAccounts).delete(authMiddleware , removeAllAccounts)
router
  .route("/accounts/:accountId")
  .delete(authMiddleware, paramValidator(accountIdValidator), removeAcount);


  router.route("/courses").get(authMiddleware, getUserCourses);
  router
    .route("/tickets")
    .get(
      authMiddleware,
      queryValidator(queryFindTicketsSchema),
      getUserTickets
    );


router
  .route("/:userId")
  .delete(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),
    removeUser
  )
  .get(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),
    getUserInfo
  );

router
  .route("/:userId/change-role")
  .patch(
    authMiddleware,
    checkRole("admin"),
    paramValidator(userIdValidator),
    bodyValidator(userRoleValidator),
    changeUserRole
  );


export default router;
