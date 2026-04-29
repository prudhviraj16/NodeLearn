const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Firstname is required"],
      validate: [validator.isAlpha, "First name can only contain letters"],
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [validator.isAlpha, "Last name can only contain letters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: [true, "A user with same email already exist."],
      validate: [validator.isEmail, "Email provided is not valid"],
    },
    photo: String,
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password and confirm Password are not equal",
      },
    },
    passwordChangedAt : Date,
    role : {
      type : String,
      enum : ['user', 'admin', 'super']
    },
    resetToken:String,
    resetTokenExpiresAt : Date
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
});

userSchema.methods.comparePassword = async(password,savedPassword) => {
    return bcrypt.compare(password,savedPassword)
}

userSchema.methods.isPasswordChanged = async function(tokenIssuedAt){
    if(this.passwordChangedAt){
        const passwordChangeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return tokenIssuedAt < passwordChangeTimeStamp
    }
    return false
}

userSchema.methods.generateResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetTokenExpiresAt = Date.now() + (10*60*1000)
    return resetToken
}

module.exports = mongoose.model("User", userSchema);
