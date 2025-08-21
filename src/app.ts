import express from "express"
import cookieParser from "cookie-parser"
const app = express()

import authRouter from "./modules/auth/auth.route"

import {errorHandler} from "./middlewares/errorHandler"

// set built in middlewares for recive values from body
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());



app.use("/auth" , authRouter)


// set error-handler
app.use(errorHandler)

export default app