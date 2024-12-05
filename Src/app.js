const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

let a = 10
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.DB_URl)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const viewPath = path.join(__dirname, "../Templates/views");
const patialsPath = path.join(__dirname, "../Templates/partials");
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", viewPath);
app.use(express.static(publicPath));
app.use("/", require("../Router/userRouter"));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
