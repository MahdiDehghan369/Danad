import express from "express"
const router = express.Router()

import {getMe, loginWithEmail, logout, refreshToken, register} from "./auth.ctrl"
import {registerValidator} from "./auth.validator"
import {bodyValidator} from "./../../middlewares/bodyValidator"
import { authMiddleware } from "../../middlewares/auth"

router.route("/register").post(bodyValidator(registerValidator) , register)
router.route("/login/email").post(loginWithEmail)
router.route("/refresh-token").post(refreshToken)
router.route("/logout").post(logout)
router.route("/me").get(authMiddleware , getMe)

export default router