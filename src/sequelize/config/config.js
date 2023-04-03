require("dotenv").config({ path: __dirname + "/./../../../.env" });
console.log("my process", process.env.MYSQL_HOST);
console.log("my process", process.env.MYSQL_USERNAME);
module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_TYPE,
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "exam_app",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+07:00",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+07:00",
  },
};
