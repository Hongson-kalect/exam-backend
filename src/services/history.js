const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const {
  makeArray,
  shuffleArray,
  checkValidUser,
  checkScore,
  getUserScore,
} = require("../ultis/function");
const examSevices = require("./exam");
const { getEmailByToken } = require("./global");
const questionService = require("./question");
const historySevices = {
  getHistory: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      if (data.id) {
        let score = 0;
        let res = await db.History.findOne({
          // where: { subjectId: data.subjectId, testRoomId: data.testRoomId,userId:data.userId,id:id },
          where: { id: Number(data.id) || 0 },
          raw: true,
        });
        const getRoom = await db.TestRoom.findOne({
          where: {
            id: Number(data.roomId) || 0,
          },
          raw: true,
        });
        const test = await db.Test.findOne({
          where: {
            id: Number(data.testId) || 0,
          },
        });
        if (getRoom.allowSeeScore) {
          score = checkScore(test.question, data.userAnser.split("|"));
          res.score = score;
        }
        res.allowSeeExplane = getRoom.allowSeeExplane;
        res.allowSeeResult = getRoom.allowSeeResult;
        return res;
      } else if (data.subjectId) {
        let result = "";
        if (data.getAll) {
          result = await db.History.findAll({
            where: {
              subjectId: Number(data.subjectId) || 0,
              testRoomId: Number(data.roomId),
              timeAttemp: {
                [Op.gt]: data.isFree == "1" ? -1 : 0,
              },
              [Op.or]: [
                {
                  userId: {
                    [Op.like]: `%${data.search}%`,
                  },
                },
                {
                  timeAttemp: Number(data.search) || -1,
                },
              ],
            },
            raw: true,
            order: [
              ["userId", "ASC"],
              ["timeAttemp", "DESC"],
            ],
          });
        } else
          result = await db.History.findAll({
            where: {
              subjectId: Number(data.subjectId) || 0,
              testRoomId: Number(data.roomId) || 0,
              userId: email,
              timeAttemp: {
                [Op.gt]: data.isFree === "1" ? -1 : 0,
              },
            },
            order: [
              ["userId", "ASC"],
              ["timeAttemp", "DESC"],
            ],
          });
        for (let index = 0; index < result.length; index++) {
          result[index].score = {
            ...(await getUserScore(
              result[index].userAnser,
              result[index].testId
            )),
          };
        }
        console.log(result);
        return result;
      }
    } else
      return { status: -1, message: "You not have permission on this task" };
    // const result = await db.History.findAll({
    //   where: {
    //     [Op.or]: {
    //       id: { [Op.like]: `%${data.input}%` || "" },
    //       code: { [Op.like]: `%${data.input}%` || "" },
    //       name: { [Op.like]: `%${data.input}%` || "" },
    //       description: { [Op.like]: `%${data.input}%` || "" },
    //     },
    //   },
    // });
    return false;
  },
};
module.exports = historySevices;
