const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const hotelRouter = require("./routers/hotelRouter");
const userRouter = require("./routers/usersRouter");
const app = express();
dotenv.config({
  path: "./config.env",
});
const connectionString = process.env.CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then((conn) => console.log("Connection to DB successful"))
  .catch((err) => console.log("Couldn't connect to MongoDB"));
    const logger = (req, res, next) => {
    console.log(req.method, req.url);
    next();
    };

app.use(express.json());
app.use(express.static("./public"));
if(process.env.NODE_ENV === 'development'){
    app.use(morgan());
    app.use(logger);
}

app.use("/api/hotels", hotelRouter);
app.use("/api/users", userRouter);
const port = process.env.PORT;
app.listen(port, () => {
  console.log("App is listening on the port 4200");
});
