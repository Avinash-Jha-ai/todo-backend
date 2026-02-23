const express =require("express")
const cookieparser=require("cookie-parser")
const app =express();

app.use(express.json());
app.use(cookieparser());

const authRouter =require("../src/routes/auth.route");
app.use("/api/auth",authRouter);

module.exports=app;