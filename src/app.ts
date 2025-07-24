import express from "express"
import cookieParser from "cookie-parser"
const app = express()

import { errorHandler } from "./presentation/middlewares/errorHandler";

import authRouter from "./presentation/routes/auth.route";

app.use(express.json())
app.use(cookieParser())
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
  })
);


app.use("/auth" , authRouter)

app.use(errorHandler)

export default app;