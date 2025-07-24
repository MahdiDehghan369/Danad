import express from "express"
const app = express()

import { errorHandler } from "./presentation/middlewares/errorHandler";

import authRouter from "./presentation/routes/auth.route";

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
  })
);


app.use("/auth" , authRouter)

app.use(errorHandler)

export default app;