import { Router } from "express";
const router: Router = Router()

import {
  registerUser,
  loginUserWithEmail,
  logoutUser
} from "../controllers/auth/auth.ctrl";

router.route("/register").post(registerUser)
router.route("/login/email").post(loginUserWithEmail);
router.route("/logout").post(logoutUser);

export default router