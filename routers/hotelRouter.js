const hotelController = require("../controller/hotelsController");
const authController = require("../controller/authController");
const express = require("express");
const hotelRouter = express.Router();

hotelRouter.route("/get-featured").get(hotelController.getFeaturedHotels);

hotelRouter.route("/get-hotels-by-city").get(hotelController.getHotelsByCity);

hotelRouter.route("/get-hotels-by-type").get(hotelController.getHotelsByType);

// hotelRouter.route("/get-hotel-stats").get(hotelController.getHotelStats);

// hotelRouter
//   .route("/get-hotel-by-category/:category")
//   .get(hotelController.getHotelByCategory);

hotelRouter
  .route("/")
  .get(hotelController.getAll)
  .post(authController.isAuthenticated,authController.isAuthorized('admin', 'super'), hotelController.create);

hotelRouter
  .route("/:id")
  .get(hotelController.getById)
  .patch(authController.isAuthenticated, authController.isAuthorized('admin'), hotelController.update)
  .delete(authController.isAuthenticated,authController.isAuthorized('admin', 'super'), hotelController.delete);

module.exports = hotelRouter;
