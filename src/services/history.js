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
    if (checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      if (data.id) {
        let score = 0;
        let res = await db.History.findOne({
          // where: { subjectId: data.subjectId, testRoomId: data.testRoomId,userId:data.userId,id:id },
          where: { id: data.id },
          raw: true,
        });
        const getRoom = await db.TestRoom.findOne({
          where: {
            id: data.roomId,
          },
          raw: true,
        });
        const test = await db.Test.findOne({
          where: {
            id: data.testId,
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
              subjectId: data.subjectId,
              testRoomId: data.roomId,
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
                  timeAttemp: {
                    [Op.like]: `%${data.search}%`,
                  },
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
              subjectId: data.subjectId,
              testRoomId: data.roomId,
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
  add: async (data) => {
    let tests = "";
    for (i = 0; i < data.testSubjectList.length; i++) {
      if (data.testSubjectList[i] != "") {
        tests += data.testSubjectList[i] + "|";
      }
    }
    const result = await db.History.create({
      name: data.name,
      subjectId: data.subjectId,
      testId: tests,
      limitTime: data.limitTime,
      time: data.shift,
      day: data.date,
      allowSeeResult: data.seeResult,
      allowSeeExplane: data.seeExplain,
      allowSeeScore: data.seeScore,
      maxAttemps: data.attempLimit,
      description: data.description || "",
    });
    if (result) return true;
    else return false;
  },

  editHistory: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      let testId = data.testId.join("|");
      await db.History.update(
        {
          name: data.name,
          description: data.description,
          maxAttemps: data.maxAttemps,
          testId,
          limitTime: data.limmitTime,
          time: data.time,
          allowSeeExplane: data.allowSeeExplane,
          allowSeeResult: data.allowSeeExplane,
          allowSeeScore: data.allowSeeScore,
        },
        {
          where: {
            id: data.historyId,
          },
        }
      );
      return { status: 1, message: "Edit completed" };
    } else return { status: -1, message: "You not have permission" };
  },
  delHistory: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      await db.History.destroy({
        where: {
          id: data.id,
        },
      });
      return { status: 1, message: "Delete completed" };
    } else
      return { status: -1, message: "You not have permission on this task" };
  },
  getHistoryType: async (data) => {
    const result = await db.History.findAll({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },

  addHistoryType: async (data) => {
    const result = await db.History.create({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },
};
module.exports = historySevices;
