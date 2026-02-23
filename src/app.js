const express = require("express")
const cookieparser = require("cookie-parser")
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: ["https://todo-rift.onrender.com/", "https://todo-rift.onrender.com/"],
    credentials: true
}))
app.use(express.static("./public"))

const authRouter = require("../src/routes/auth.route");
app.use("/api/auth", authRouter);

module.exports = app;