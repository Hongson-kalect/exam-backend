const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const globalSevices = {
  signUp: async (data) => {
    const emailExist = await isExistEmail(data.email);
    if (!emailExist) {
      await db.User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        token: data.token,
        avatar: data?.avatar || "",
      });
      return true;
    } else {
      return "Email already exist in database";
    }
  },
  getUser: async (data) => {
    const modelRes = await db.User.findOne({
      attributes: { exclude: ["id", "password"] },
      where: {
        [Op.and]: [
          {
            email: data.email,
            // [Op.or]: [{ email: data.email }, { userName: data.email }],
          },
          { password: data.password },
        ],
      },
    });
    return modelRes;
  },
  getUserByToken: async (data) => {
    const modelRes = await db.User.findOne({
      attributes: { exclude: ["password"] },
      where: {
        token: data.token,
      },
    });
    return modelRes;
  },
};
const isExistEmail = async (email) => {
  const modelRes = await db.User.findAll({
    where: {
      email: email,
    },
  });
  if (modelRes.length > 0) return true;
  return false;
};
const getEmailByToken = async (token) => {
  const modelRes = await db.User.findOne({
    attributes: ["email"],
    where: {
      token: token,
    },
    raw: true,
  });
  if (modelRes.email) return modelRes.email;
  return false;
};
const ExcelToDatabase = async (subjectId, file, tableName) => {
  // this only work if start with column A, not count first row, arrange column position in excel file is correct
  const xlsx = require("xlsx");
  console.log("file", file);
  const workbook = xlsx.readFile(file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = await db[tableName].rawAttributes;
  console.log(Object.keys(data));
  const tableColumn = Object.keys(data);
  const HeaderArray = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  let posts = [];
  let post = {};
  let addValue = {};
  let tableWidth = tableColumn.length;
  let currentRow = 0;
  let isSetCurrentRow = false;

  for (let cell in worksheet) {
    const cellAsString = cell.toString();
    console.log(cellAsString[0]); //ignore first row (for header)

    if (
      cellAsString[1] !== "r" &&
      cellAsString[1] !== "m" &&
      cellAsString[1] > 1
    ) {
      //Get first row
      if (!isSetCurrentRow) {
        currentRow = Number(cellAsString[1]) || cellAsString[1];
        isSetCurrentRow = true;
      }
      //Create new line if go to orther row
      if (cellAsString[1] !== currentRow) {
        addValue.subjectId = subjectId;
        await db[tableName].create(addValue);
        addValue = {};
        currentRow = Number(cellAsString[1]) || cellAsString[1];
      }
      addValue[tableColumn[HeaderArray.indexOf(cellAsString[0]) + 2]] =
        worksheet[cell].v;
    }
  }
  await db[tableName].create(addValue); //add the last row
  return true;
};

module.exports = { globalSevices, getEmailByToken, ExcelToDatabase };
