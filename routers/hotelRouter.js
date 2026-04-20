const hotelController = require("../controller/hotelsController");
const express = require("express");
const hotelRouter = express.Router();

hotelRouter
  .route("/get-featured")
  .get(hotelController.getFeaturedHotels, hotelController.getAll);

hotelRouter
  .route("/get-hotel-stats")
  .get(hotelController.getHotelStats);

hotelRouter
  .route("/get-hotel-by-category/:category")
  .get(hotelController.getHotelByCategory);

hotelRouter.route("/").get(hotelController.getAll).post(hotelController.create);

hotelRouter
  .route("/:id")
  .get(hotelController.getById)
  .patch(hotelController.update)
  .delete(hotelController.delete);

module.exports = hotelRouter;
