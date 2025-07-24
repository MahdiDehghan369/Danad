import { Router } from "express";
const router: Router = Router()

import { registerUser } from "../controllers/auth/auth.ctrl";

router.route("/register").post(registerUser)

export default router