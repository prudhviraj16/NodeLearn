const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstname : {
        type : String, 
        trim : true,
        lowercase : true,
        required : [true, "Firstname is required"],
        validate : [validator.isAlpha, 'First name can only contain letters']
    },
    lastname : {
        type : String,
        trim : true,
        lowercase : true,
        validate : [validator.isAlpha, 'Last name can only contain letters']
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        trim : true,
        lowercase : true,
        unique : true,
        validate : [validator.isEmail, 'Email provided is not valid']
    },
    photo:String,
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : 8,
    },
    confirmPassword : {
        type : String,
        required : true,
    }
}, {timestamps : true})

module.exports = mongoose.model('User', userSchema)