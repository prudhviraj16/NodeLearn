const AppError = require("../utilities/appError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stackTrace,
    error: error,
  });
};

const handleCastError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const errorMessage = `Invalid value ${value} for property ${field}`;
  const err = new AppError(errorMessage, 400);
  return err;
};
const duplicateKeyHandler = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  console.log(field);
  console.log(value);
  const errorMessage = `A document with ${field} and ${value} already exists`;
  const err = new AppError(errorMessage, 400);
  return err;
};
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((value) => {
    return value.message;
  });
  const message = errors.join(". ");
  const errorMessage = `User validation failed: ${message}`;
  const err = new AppError(errorMessage, 400);
  return err;
};

const handleJwtError = (error) => {
  const errorMessage = `Access token is not valid. Please login again`;
  const err = new AppError(errorMessage, 401);
  return err;
};
const handleTokenExpiredError = (error) => {
  const errorMessage = `Access token has expired. Please login again`;
  const err = new AppError(errorMessage, 401);
  return err;
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(error.statusCode).json({
      status: "error",
      message: "Something went wrong. Please try again later!",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  let appError = error;
  if (process.env.NODE_ENV === "development") {
    if (error.name === "CastError") {
      appError = handleCastError(error);
    }
    if (error.code === 11000) {
      appError = duplicateKeyHandler(error);
    }
    if (error.name === "ValidationError") {
      appError = handleValidationError(error);
    }
    if (error.name === "JsonWebTokenError") {
      appError = handleJwtError(error);
    }
    if (error.name === "TokenExpiredError") {
      appError = handleTokenExpiredError(error);
    }
    devErrors(res, appError);
  } else {
    if (error.name === "CastError") {
      appError = handleCastError(error);
    }
    prodErrors(res, appError);
  }
};
