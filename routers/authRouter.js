const authController = require("../controller/authController");
const express = require("express");
const authRouter = express.Router();

authRouter
  .route("/signup")
  .post(authController.signup)
authRouter
  .route("/login")
  .post(authController.signin)
authRouter
  .route("/forgotPassword")
  .post(authController.forgotPassword)
authRouter
  .route("/resetPassword/:token")
  .patch(authController.resetPassword)

module.exports = authRouter
