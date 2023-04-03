const multer = require("multer");
const db = require("../sequelize/models");

const testLayout = async (req, res) => {
  const xlsx = require("xlsx");
  console.log("file", req.file);
  console.log("path", req.file.path);
  // const workbook = xlsx.readFile(filePath);
  // const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  let posts = [];
  let post = {};

  // for (let cell in worksheet) {
  //   const cellAsString = cell.toString();
  //   let isFirstRow = true;
  //   if (isFirstRow) {
  //     isFirstRow = false;
  //     continue;
  //   }

  //   if (
  //     cellAsString[1] !== "r" &&
  //     cellAsString[1] !== "m" &&
  //     cellAsString[1] > 1
  //   ) {
  //     if (cellAsString[0] === "A") {
  //       post.title = worksheet[cell].v;
  //     }
  //     if (cellAsString[0] === "B") {
  //       post.author = worksheet[cell].v;
  //       posts.push(post);
  //       post = {};
  //     }
  //   }
  // }
  res.json("qq");
};
module.exports = { testLayout };
