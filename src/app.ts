import express from "express"
import cookieParser from "cookie-parser"
const app = express()

import authRouter from "./modules/auth/auth.route"
import banRouter from "./modules/ban/ban.route"
import userRouter from "./modules/user/user.route";
import categoryRouter from "./modules/category/category.route";
import courseRouter from "./modules/course/course.route";
import walletRouter from "./modules/wallet/wallet.route";

import {errorHandler} from "./middlewares/errorHandler"

// set built in middlewares for recive values from body
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());



app.use("/auth" , authRouter)
app.use("/ban" , banRouter)
app.use("/users" , userRouter)
app.use("/categories" , categoryRouter)
app.use("/courses" , courseRouter)
app.use("/wallet", walletRouter);

    
// set error-handler
app.use(errorHandler)

export default app