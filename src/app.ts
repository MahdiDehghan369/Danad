import express from "express"
import cookieParser from "cookie-parser"
const app = express()

import authRouter from "./modules/auth/auth.route"
import banRouter from "./modules/ban/ban.route"
import userRouter from "./modules/user/user.route";
import categoryRouter from "./modules/category/category.route";
import courseRouter from "./modules/course/course.route";
import walletRouter from "./modules/wallet/wallet.route";
import transactionRouter from "./modules/transaction/transaction.route";
import courseDiscountRouter from "./modules/discount/discount.route";
import couponRouter from "./modules/coupen/coupon.route";
import cartRouter from "./modules/cart/cart.route";
import departmentRouter from "./modules/department/department.route";
import ticketRouter from "./modules/ticket/ticket.route";
import commentRouter from "./modules/comment/comment.route";
import sectionRouter from "./modules/section/section.route";
import sessionRouter from "./modules/session/session.route";
import articleRouter from "./modules/article/article.route";

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
app.use("/transactions", transactionRouter);
app.use("/course-discounts", courseDiscountRouter);
app.use("/coupons", couponRouter);
app.use("/carts", cartRouter);
app.use("/departments", departmentRouter);
app.use("/tickets", ticketRouter);
app.use("/comments", commentRouter);
app.use("/sections", sectionRouter);
app.use("/sessions", sessionRouter);
app.use("/articles", articleRouter);

    
// set error-handler
app.use(errorHandler)

export default app