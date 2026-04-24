const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const hotelRouter = require("./routers/hotelRouter");
const userRouter = require("./routers/usersRouter");
const AppError = require("./utilities/appError");
const globalErrorHandler = require("./controller/errorController");

process.on("uncaughtException", (error) => {
  console.log(error.name + ": " + error.message);
  console.log("Unhandled Rejection Occured. Shutting down...");
  app.close(() => {
    process.exit(1);
  });
});

const app = express();
dotenv.config({
  path: "./config.env",
});
const connectionString = process.env.CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then((conn) => console.log("Connection to DB successful"))
  .catch((err) => console.log("Could not connect the database",err))

const logger = (req, res, next) => {
  next();
};

app.use(express.json());
app.use(express.static("./public"));
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
  app.use(logger);
}

app.use("/api/hotels", hotelRouter);
app.use("/api/users", userRouter);
app.use((req, res, next) => {
  const error = new AppError(
    `Cannot find the resource ${req.originalUrl}`,
    404,
  );
  next(error);
});
app.use(globalErrorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("App is listening on the port 4200");
});

process.on("unhandledRejection", (error) => {
  console.log(error.name + ": " + error.message);
  console.log("Unhandled Rejection Occured. Shutting down...");
  app.close(() => {
    process.exit(1);
  });
});
