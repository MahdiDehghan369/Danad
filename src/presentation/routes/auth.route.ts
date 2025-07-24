import { Router } from "express";
const router: Router = Router()

import {
  registerUser,
  loginUserWithEmail,
} from "../controllers/auth/auth.ctrl";

router.route("/register").post(registerUser)
router.route("/login/email").post(loginUserWithEmail);

export default router