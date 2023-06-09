const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const {
  makeArray,
  shuffleArray,
  checkValidUser,
} = require("../ultis/function");
const { getEmailByToken } = require("./global");
const questionService = require("./question");
const { getTest } = require("./test");
const testRoomSevices = {
  add: async (data) => {
    console.log(data);
    const testId = data.testSubjectList.join("|");
    const email = await getEmailByToken(data.userId);
    const result = await db.TestRoom.create({
      name: data.name,
      subjectId: Number(data.subjectId) || 0,
      testId: testId,
      limitTime: data.limitTime,
      time: data.shift,
      day: data.date,
      freeTest: 0,
      maxAttemps: Number(data.attempLimit) || 0,
      description: data.description,
      allowSeeResult: data.seeResult,
      allowSeeExplane: data.seeExplain,
      allowSeeScore: data.seeScore,
    });
    if (result) return true;
    else return false;
  },
  getTestRoom: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      if (data.roomId) {
        const res = await db.TestRoom.findOne({
          where: {
            subjectId: Number(data.subjectId) || 0,
            id: Number(data.roomId) || 0,
          },
        });
        return res;
      } else if (data.subjectId) {
        const res = await db.TestRoom.findAll({
          where: { subjectId: Number(data.subjectId) || 0 },
        });
        return res;
      }
    } else
      return { status: -1, message: "You not have permission on this task" };
    // const result = await db.TestRoom.findAll({
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

  editTestRoom: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      console.log(data);
      let testId = data.testId.join("|");
      await db.TestRoom.update(
        {
          name: data.name,
          description: data.description,
          maxAttemps: Number(data.maxAttempt) || 0,
          testId,
          limitTime: data.limmitTime,
          time: data.time,
          allowSeeExplane: data.allowSeeExplane,
          allowSeeResult: data.allowSeeExplane,
          allowSeeScore: data.allowSeeScore,
          freeTest: data.isFreeTest,
        },
        {
          where: {
            id: Number(data.testRoomId) || 0,
          },
        }
      );
      return { status: 1, message: "Edit completed" };
    } else return { status: -1, message: "You not have permission" };
  },
  delTestRoom: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      await db.TestRoom.destroy({
        where: {
          id: Number(data.id) || 0,
        },
      });
      return { status: 1, message: "Delete completed" };
    } else
      return { status: -1, message: "You not have permission on this task" };
  },
  getUnSubmit: async (data) => {
    // if (await checkValidUser(data.userId, data.subjectId)) {
    const userEmail = await getEmailByToken(data.userId);
    const getData = await db.History.findOne({
      where: {
        userId: userEmail,
        testRoomId: Number(data.roomId) || 0,
        submited: false,
      },
      raw: true,
    });
    console.log("getData", getData);
    if (getData) {
      return { status: 1, data: getData };
    } else return { status: 1, data: false };
    // } else
    //   return { status: -1, message: "You not have permission on this task" };
  },
  getResult: async (data) => {
    // if (await checkValidUser(data.userId, data.subjectId)) {
    const userEmail = await getEmailByToken(data.userId);
    const getHistory = await db.History.findOne({
      where: {
        id: Number(data.historyId) || 0,
      },
      raw: true,
    });
    console.log(getHistory);
    if (getHistory.testRoomId) {
      let anserList = [];
      const res = await db.TestRoom.findOne({
        where: {
          id: Number(getHistory.testRoomId) || 0,
        },
      });

      const test = await getTest({
        id: Number(getHistory.testId) || 0,
        userId: data.userId,
        subjectId: data.subjectId,
      });
      const questionsHash = test.dataValues.question;
      let questionHashArr = questionsHash
        .split("|")
        .filter((item) => item !== "");
      let questions = [];
      for (let index = 0; index < questionHashArr.length; index++) {
        let questionCode = [];
        let questionItem = {};
        questionCode = questionHashArr[index]
          .split("-")
          .filter((item) => item !== "");
        const questionDetailRes = await questionService.getQuestion({
          id: Number(questionCode[0]) || 0,
          userId: data.userId,
          subjectId: data.subjectId,
        });
        const questionDetail = questionDetailRes.dataValues;
        anserList = questionDetailRes.dataValues.anser
          .split("|")
          .filter((item) => item !== "");
        questionItem.question = questionDetail.question;

        const ansers = [];
        for (let index = 1; index < questionCode.length; index++) {
          ansers.push(anserList[questionCode[index]]);
        }
        questionItem.ansers = ansers;
        questions.push(questionItem);
      }

      res.dataValues.userAnserChar = getHistory.userAnser.split("|");
      res.dataValues.userAnser = getHistory.userAnser
        .replaceAll("a", "0")
        .replaceAll("b", "1")
        .replaceAll("c", "2")
        .replaceAll("d", "3")
        .split("|");
      // res.dataValues.userAnser = getHistory.userAnser.split("|");
      // data.userAnser.split("|").filter((item) => item !== "") || "";
      res.dataValues.questions = questions;
      res.dataValues.testId = getHistory.testId;
      if (res.dataValues.allowSeeResult)
        res.dataValues.anser = test.dataValues.question;
      console.log(res.dataValues);
      return { status: 1, data: res };
    }
    // console.log("getData", getData);
    // if (getData) {
    //   return { status: 1, data: getData };
    // } else return { status: 1, data: false };
    // } else
    //   return { status: -1, message: "You not have permission on this task" };
  },
  getTestRoomType: async (data) => {
    const result = await db.TestRoom.findAll({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },

  addTestRoomType: async (data) => {
    const result = await db.TestRoom.create({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },
  getAttempt: async (data) => {
    const userEmail = await getEmailByToken(data.userId);
    if (await checkValidUser(data.userId, data.subjectId)) {
      const isFreeTest = await db.TestRoom.findOne({
        attributes: ["freeTest", "maxAttemps"],
        where: {
          id: Number(data.roomId),
        },
        raw: true,
      });
      if (isFreeTest.freeTest) {
        return { status: 1, freeTest: true, timeAttemp: 0 };
      } else {
        const currentAttempt = await db.History.findOne({
          attributes: [
            [sequelize.fn("max", sequelize.col("timeAttemp")), "timeAttemp"],
          ],
          where: {
            testRoomId: Number(data.roomId) || data.roomId || 0,
            userId: userEmail,
          },
          raw: true,
        });
        const attemp = (currentAttempt.timeAttemp || 0) + 1;
        if (attemp <= isFreeTest.maxAttemps)
          return {
            status: 1,
            freeTest: false,
            timeAttemp: attemp,
          };
        return {
          status: 0,
          message: "You run out of attempt on this Test room",
        };
      }
    }
    return { status: -1, message: "You not have permission on this task" };
  },
  startAttempt: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const userEmail = await getEmailByToken(data.userId);
      const getLimeLimit = await db.TestRoom.findOne({
        attributes: ["limitTime"],
        where: {
          id: Number(data.roomId) || 0,
        },
      });
      const limitTime = Number(getLimeLimit.limitTime) || "10";
      const createHistory = await db.History.create(
        {
          userId: userEmail,
          subjectId: Number(data.subjectId) || 0,
          testRoomId: Number(data.roomId) || 0,
          testId: Number(data.testId) || 0,
          userAnser: "",
          timeAttemp: Number(data.timeAttemp) || 0,
          submited: false,
        },
        {
          raw: true,
        }
      );
      const historyResId = createHistory.id;
      setTimeout(async () => {
        await db.History.update(
          {
            submited: true,
          },
          {
            where: {
              id: Number(historyResId) || 0,
              // subjectId: data.subjectId,
              // testRoomId: data.roomId,
              // testId: data.testId,
              // timeAttemp: data.timeAttemp,
            },
          }
        );
      }, Number(limitTime) * 60000);
      return { status: 1, data: createHistory };
    }
    return { status: -1, message: "You not have permission on this task" };
  },
};
module.exports = testRoomSevices;
