const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Hotel name is required"],
    trim : true
  },
  description :  {
    type: String,
    required: [true, "Hotel Description is required"],
    trim : true
  },
  type: {
    type: String,
    required: [true, "Hotel type is required"],
  },
  category : {
    type : [String],
    required : true
  },
  city: {
    type: String,
    required: [true, "Hotel City is required"],
  },
  address : {
    type : String,
    required: [true, "Hotel Address is required"],
  },
  distance: {
    type: String  ,
    required: [true, "Hotel distance from airport is required"]
  },
  images : {
    type : [String]
  },
  ratings : {
    type : Number,
    min : 0,
    max : 5
  },
  rooms : {
    type : [String]
  },
  cheapestPrice : {
    type : Number,
    required : true
  },
  featured : {
    type : Boolean,
    default : false
  }
});
module.exports = mongoose.model('Hotel', hotelSchema)