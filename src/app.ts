import express from "express"
const app = express()

import authRouter from "./presentation/routes/auth.route";

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
  })
);


app.use("/auth" , authRouter)


export default app;