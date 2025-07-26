import { Router } from "express";
const router: Router = Router()

import { authMiddleware } from "../middlewares/auth";

import {
  registerUser,
  loginUserWithEmail,
  logoutUser,
  refreshToken,
  getMe
} from "../controllers/auth/auth.ctrl";

router.route("/register").post(registerUser)
router.route("/login/email").post(loginUserWithEmail);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshToken);
router.route("/me").get(authMiddleware, getMe);

export default router