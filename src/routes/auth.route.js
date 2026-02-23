const express =require("express");
const authcontroller =require("../controllers/auth.controller")
const { googleLogin } = require("../controllers/auth.controller");

const authrouter =express.Router();

authrouter.post("/register",authcontroller.registercontroller);
authrouter.post("/google-login", authcontroller.googleLogin);

authrouter.post("/login",authcontroller.logincontroller);


module.exports = authrouter;