const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const { checkValidUser } = require("../ultis/function");
const { getEmailByToken } = require("./global");
const userSevices = {
  getUserByEmail: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const result = await db.User.findOne({
        attributes: {
          exclude: ["password", "token"],
        },
        where: {
          email: data.email,
        },
      });
      if (result?.dataValues) {
        return { status: 1, data: result };
      } else {
        return { status: 0, message: "Not found user" };
      }
    }
    return { status: -1, message: "You not have permission on this task" };
  },
};
module.exports = userSevices;
