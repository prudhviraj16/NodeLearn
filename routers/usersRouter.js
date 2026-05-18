const userController = require('../controller/userController')
const authController = require('../controller/authController')
const express = require('express')
const userRouter = express.Router()

userRouter.route('/updatePassword').patch(authController.isAuthenticated,userController.updatePassword)

module.exports = userRouter