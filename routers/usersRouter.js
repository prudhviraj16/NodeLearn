const userController = require('../controller/userController')
const express = require('express')
const userRouter = express.Router()

const paramMiddleWare = (req,res,next,value,name) => {
    console.log('Id Route Parameter Value: ' + value)
    next()
}
userRouter.param('id', paramMiddleWare)

userRouter.route("/")
   .get(userController.getAll)

userRouter.route("/:id")
    .get(userController.getById)

module.exports = userRouter