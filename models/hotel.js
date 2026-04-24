const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      lowercase: true,
      unique : true
    },
    description: {
      type: String,
      required: [true, "Hotel Description is required"],
      trim: true,
      set : (value) => {
        return value.substring(0,100)
      }
    },
    type: {
      type: String,
      required: [true, "Hotel type is required"],
      enum : {
        values : ['Hotel', 'Resort', 'Apartment', 'Villa', 'Cabin'],
        message : 'The provided hotel type is not valid'
      }
    },
    category: {
      type: [String],
      required: true,
    },
    city: {
      type: String,
      required: [true, "Hotel City is required"],
    },
    address: {
      type: String,
      required: [true, "Hotel Address is required"],
    },
    distance: {
      type: String,
      required: [true, "Hotel distance from airport is required"],
    },
    images: {
      type: [String],
    },
    ratings: {
      type: Number,
      min : [0, 'Ratings cannot be less than 0'],
      max : [5, 'Ratings cannot be greater than 5']
    },
    rooms: {
      type: [String],
    },
    cheapestPrice: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
hotelSchema.virtual("isPremium").get(function () {
  return this.cheapestPrice > 200;
});

hotelSchema.pre("save", function (next) {
  this.createdBy = "Prudhvi Jwala";
});

hotelSchema.pre("save", function (next) {
  if (this.cheapestPrice < 100) {
    throw new Error("Price of a hotel cannot be less than 100");
  }
});

hotelSchema.post("save", function (doc, next) {
  const content = `${new Date()} : A new hotel document with name ${doc.name} is created`;
  const filePath = path.join(__dirname, "..", "logs", "log.txt");
  fs.writeFileSync(filePath, content, { flag: "a" }, (error) => {
    console.log(error.message);
  });
  next();
});

module.exports = mongoose.model("Hotel", hotelSchema);
