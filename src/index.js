const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const indexRoute = require("./routes/index.js");
const connectBD = require("./sequelize/config/connectDB");

const app = express();

var corsOptions = {
  origin: process.env.FRONTEND_HOST,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/question", question);
// connectBD();

app.use("/api", indexRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
console.log(process.env.PORT);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.PORT || 3000}!`)
);
