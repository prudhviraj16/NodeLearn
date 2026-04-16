const hotelController = require('../controller/hotelsController')
const express = require('express')
const hotelRouter = express.Router()

hotelRouter.param('id', hotelController.checkHotelExist)

hotelRouter.route("/")
   .get(hotelController.getAll)
   .post(hotelController.validateRequestBody, hotelController.create)

hotelRouter.route("/:id")
   .get(hotelController.getById)
   .patch(hotelController.update)
   .delete(hotelController.delete)

module.exports = hotelRouter