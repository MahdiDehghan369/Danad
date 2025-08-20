import express from "express"
const router = express.Router()

import {register} from "./auth.ctrl"
import {registerValidator} from "./auth.validator"
import {bodyValidator} from "./../../middlewares/bodyValidator"

router.route("/register").post(bodyValidator(registerValidator) , register)
// router.route("/login/email").post()

export default router