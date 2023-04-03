const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const indexRoute = require("./routes/index.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/question", question);

app.use("/api", indexRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
console.log(process.env.PORT);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.PORT || 3000}!`)
);
