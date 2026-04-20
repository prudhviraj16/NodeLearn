const Hotel = require("../models/hotel");
const ApiFeatures = require("./../utilities/features");

exports.getAll = async (req, res) => {
  const features = new ApiFeatures(Hotel.find(), req.query);
  try {
    const hotels = features.filter().sort().limitFields().paginate().queryObj;
    const query = await hotels;
    res.status(201).json({
      status: "success",
      count: query.length,
      data: {
        data: query,
      },
    });
  } catch (err) {
    console.log(err, "here");
    res.status(500).json({
      status: "fail",
      message: "Something went wrong. Please try again later.",
      error: err,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findById(id);
    res.status(201).json({
      status: "success",
      data: {
        data: hotel,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong. Please try again later",
    });
  }
};

exports.create = async (req, res) => {
  try {
    const newHotel = await Hotel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        movie: newHotel,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findById(id);
    const body = req.body;
    const updatedHotel = await Hotel.findByIdAndUpdate(id, body, { new: true });
    res.status(201).json({
      status: "success",
      data: {
        data: updatedHotel,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong. Please try again later",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findByIdAndDelete(id);
    res.status(201).json({
      status: "success",
      data: {
        data: hotel,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong. Please try again later",
    });
  }
};

exports.getHotelStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message:
        "Something went wrong. Please try again later. Error: " + error.message,
    });
  }
};

exports.getHotelByCategory = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message:
        "Something went wrong. Please try again later. Error: " + error.message,
    });
  }
};

exports.getFeaturedHotels = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message:
        "Something went wrong. Please try again later. Error: " + error.message,
    });
  }
};

exports.getHotelsByCity = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message:
        "Something went wrong. Please try again later. Error: " + err.message,
    });
  }
};

exports.getHotelsByType = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message:
        "Something went wrong. Please try again later. Error: " + err.message,
    });
  }
};
