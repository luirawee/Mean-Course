const path = require("path");
const express = require("express");

require("dotenv").config();

const bodyParSer = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();
mongoose
  .connect(process.env.MONG_DB)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParSer.json());
app.use(bodyParSer.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE",
    "PATCH",
    "OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
