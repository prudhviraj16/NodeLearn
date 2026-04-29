const User = require("../models/user");
const ApiFeatures = require("./../utilities/features");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utilities/email");
const crypto = require("crypto");

const signToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser?._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || email === "") {
    const error = new AppError("Email is not provided", 400);
    return next(error);
  }
  if (!password || password === "") {
    const error = new AppError("Password is not provided", 400);
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new AppError("User with given email is not found", 400);
    return next(error);
  }
  console.log(user);
  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    const error = new AppError("Password is not correct", 401);
    return next(error);
  }
  const token = signToken(user?._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new AppError(
      "Cannot find the user with the provided email",
      404,
    );
    return next(error);
  }

  const plainResetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });
  const resetTokenLink = `${req.protocol}://${req.get("host")}/resetPassword/${plainResetToken}`;

  const body = `We have received a password reset request. Please use the below link to reset your password\n\n${resetTokenLink}\n\nThis Password link is valid for 10 minutes`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password change request received",
      message: body,
    });

    res.status(200).json({
      status: "success",
      token: "A password reset link has been sent to the user's email",
    });
  } catch (error) {
    console.log(error);
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    const err = new AppError(
      "There was an error sending password reset email.",
    );
    return next(err);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiresAt: { $gt: Date.now() },
  });
  console.log(req.url)
  if (!user) {
    const error = new AppError(
      "Reset token is not valid or it has been expired",
      400,
    );
    return next(error);
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  const token = signToken(user?._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token = null;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    const error = new AppError("You are not logged in", 401);
    return next(error);
  }

  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    const error = new AppError("User doesn't exist. Access denied.", 401);
    return next(error);
  }

  const passwordWasChanged = await user.isPasswordChanged(decodedToken.iat);
  if (passwordWasChanged) {
    const error = new AppError("Password was changed. Please login again", 401);
    return next(error);
  }
  req.user = user;
  next();
});

exports.isAuthorized = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const error = new AppError(
        "You do not have permission to perform this action",
        403,
      );
      return next(error);
    }
    next();
  };
};
