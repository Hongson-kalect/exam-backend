const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("sys", "admin", "bB2xKYON", {
  host: "172.106.0.61",
  dialect: "mysql",
  port: 17070,
  logging: false,
});
const connectBD = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = connectBD;
