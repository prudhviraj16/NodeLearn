const Hotel = require("../models/hotel");
const ApiFeatures = require("./../utilities/features");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Hotel.find(), req.query);
  const hotels = features.filter().sort().limitFields().paginate().queryObj;
  const query = await hotels;
  console.log(x)
  if(!query) {
    const error = new AppError('The hotel with given ID is not found', 404)
    return next(error)
  }
  res.status(201).json({
    status: "success",
    count: query.length,
    data: {
      data: query,
    },
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const hotel = await Hotel.findById(id);
  if (!hotel) {
    const error = new AppError("The hotel with given ID is not found.", 404);
    return next(error);
  }
  res.status(201).json({
    status: "success",
    data: {
      data: hotel,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const newHotel = await Hotel.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      movie: newHotel,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const hotel = await Hotel.findById(id);
  const body = req.body;
  const updatedHotel = await Hotel.findOneAndUpdate({_id : id}, body, { new: true, runValidators : true });

  if(!updatedHotel) {
    const error = new AppError('The hotel with given ID is not found', 404)
    return next(error)
  }
  res.status(201).json({
    status: "success",
    data: {
      data: updatedHotel,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const hotel = await Hotel.findByIdAndDelete(id);
  if(!hotel) {
    const error = new AppError('The hotel with given ID is not found', 404)
    return next(error)
  }
  res.status(201).json({
    status: "success",
    data: {
      data: hotel,
    },
  });
});

exports.getHotelStats = catchAsync(async (req, res, next) => {
  const stats = await Hotel.aggregate([
    { $match: { type: "Hotel" } },
    {
      $group: {
        _id: "$city",
        averagePrice: { $avg: "$cheapestPrice" },
        minPrice: { $min: "$cheapestPrice" },
        maxPrice: { $max: "$cheapestPrice" },
        totalPrice: { $sum: "$cheapestPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { minPrice: -1 } },
    { $match: { count: { $gt: 1 } } },
  ]);
  res.status(200).json({
    status: "success",
    count: stats.length,
    data: {
      stats,
    },
  });
});

exports.getHotelByCategory = catchAsync(async (req, res, next) => {
  const category = req.params.category;
  const stats = await Hotel.aggregate([
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        hotels: { $push: "$name" },
      },
    },
    { $addFields: { category: "$_id", isActive: true } },
    { $match: { category: category } },
    { $project: { _id: 0 } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  res.status(200).json({
    status: "success",
    count: stats.length,
    data: {
      stats,
    },
  });
});

exports.getFeaturedHotels = catchAsync(async (req, res, next) => {
  const featuredHotels = await Hotel.aggregate([
    { $match: { featured: true } },
    { $sort: { ratings: -1 } },
    { $limit: 4 },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      features: featuredHotels,
    },
  });
});

exports.getHotelsByCity = catchAsync(async (req, res, next) => {
  const hotelsbyCity = await Hotel.aggregate([
    {
      $group: {
        _id: "$city",
        count: { $sum: 1 },
        cheapestPrice: { $min: "$cheapestPrice" },
      },
    },
    { $addFields: { type: "_id" } },
    { $project: { _id: 0 } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      features: hotelsbyCity,
    },
  });
});

exports.getHotelsByType = catchAsync(async (req, res, next) => {
  const hotelsbyType = await Hotel.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        cheapestPrice: { $min: "$cheapestPrice" },
      },
    },
    { $addFields: { type: "_id" } },
    { $project: { _id: 0 } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      features: hotelsbyType,
    },
  });
});
