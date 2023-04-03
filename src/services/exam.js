const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const {
  makeArray,
  shuffleArray,
  checkValidUser,
} = require("../ultis/function");
const { getEmailByToken, globalSevices } = require("./global");
const { getQuestion } = require("./question");
const questionService = require("./question");
const { getTest } = require("./test");
const { getUnSubmit } = require("./testRoom");
const examSevices = {
  getExam: async (data) => {
    if (data.roomId) {
      let anserList = [];
      const res = await db.TestRoom.findOne({
        where: { subjectId: data.subjectId, Id: data.roomId },
      });
      let testArr = res.dataValues.testId.split("|");
      testArr = testArr.filter((item) => item !== "");
      const testId = testArr[Math.floor(Math.random() * testArr.length)];

      const test = await getTest({
        id: testId,
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
        const questionDetailRes = await getQuestion({
          id: questionCode[0],
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
      res.dataValues.questions = questions;
      res.dataValues.testId = testId;
      return res;
    }
    return false;
  },
  getContineu: async (data) => {
    console.log(data);
    if (checkValidUser(data.userId, data.subjectId)) {
      if (data.roomId) {
        let anserList = [];
        const res = await db.TestRoom.findOne({
          where: { subjectId: data.subjectId, Id: data.roomId },
        });

        const test = await getTest({
          id: data.testId,
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
          const questionDetailRes = await getQuestion({
            id: questionCode[0],
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
        res.dataValues.userAnser = data.userAnser.split("|");
        // data.userAnser.split("|").filter((item) => item !== "") || "";
        res.dataValues.questions = questions;
        res.dataValues.testId = data.testId;
        console.log("res", res);
        return res;
      }
    }
    return false;
  },
  submitExam: async (data) => {
    const email = await getEmailByToken(data.userId);

    const test = await getTest({
      id: data.testId,
      userId: data.userId,
      subjectId: data.subjectId,
    });
    const anser = test.dataValues.question;
    const score = await checkScore(anser, data.userAnser);
    let returnValue = {};
    let userAnserString = data.userAnser.join("|");
    let explain = await getExplain(anser);

    if (data.historyId) {
      await db.History.update(
        {
          userAnser: userAnserString,
          submited: true,
        },
        {
          where: {
            id: data.historyId,
          },
        }
      );
    } else {
      await db.History.update(
        {
          userAnser: userAnserString,
          submited: true,
        },
        {
          where: {
            subjectId: data.subjectId,
            testRoomId: data.roomId,
            testId: data.testId,
            userId: email,
            timeAttemp: data.timeAttemp,
          },
        }
      );
    }

    if (data.allowSeeScore) returnValue.score = score;
    if (data.allowSeeResult) {
      returnValue.questions = data.questions;
      returnValue.anser = anser;
      returnValue.userAnser = changeAnserToNumber(data.userAnser);
    }
    if (data.allowSeeExplane) returnValue.explain = explain;
    return returnValue;
  },
  closeTab: async (data) => {
    console.log(data);
    if (await checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      let userAnser = "";
      for (let index = 0; index < data.userAnser.length; index++) {
        if (index != data.userAnser.length - 1) {
          userAnser = userAnser + data.userAnser[index] + "|";
        } else {
          userAnser = userAnser + data.userAnser[index];
        }
      }
      console.log("userAnser", userAnser);
      if (data.historyId)
        await db.History.update(
          {
            userAnser: userAnser,
          },
          {
            where: {
              id: data.historyId,
            },
          }
        );
      else
        await db.History.update(
          {
            userAnser: userAnser,
          },
          {
            where: {
              subjectId: data.subjectId,
              testRoomId: data.roomId,
              testId: data.testId,
              userId: email,
              timeAttemp: data.timeAttemp,
            },
          }
        );
      return true;
    }
    return false;
  },
  submitCurrent: async (data) => {
    await db.History.update(
      {
        submited: true,
      },
      {
        where: {
          subjectId: data.subjectId,
          testRoomId: data.roomId,
          testId: data.testId,
          userId: email,
          timeAttemp: data.timeAttemp,
        },
      }
    );
    return true;
  },

  add: async (data) => {
    let tests = "";
    for (i = 0; i < data.testSubjectList.length; i++) {
      if (data.testSubjectList[i] != "") {
        tests += data.testSubjectList[i] + "|";
      }
    }
    const result = await db.Exam.create({
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

  editExam: async (data) => {
    let question = "";
    for (i = 0; i < data.questions.length; i++) {
      if (data.questions[i] != "") {
        const questionData = await questionService.getQuestion({
          id: data.questions[i],
        });
        if (questionData) {
          let anserArr = questionData.anser.split("|");
          anserArr = anserArr.filter((anser) => anser != "");
          const arr = makeArray(anserArr, 4);
          const sufferArr = shuffleArray(arr);
          question += data.questions[i] + "-" + sufferArr.join("-") + "|";
        }
      }
    }
    let questions = shuffleArray(question.split("|"));
    questions = questions.filter((item) => item != "");
    question = questions.join("|");
    const result = await db.Exam.update(
      {
        code: data.code,
        name: data.name,
        question: question,
        description: data.description,
        // subjectId: data.subjectId,
      },
      {
        where: {
          id: data.id,
        },
      }
    );
    if (result) return true;
    else return false;
  },
  delExam: async (data) => {
    const result = await db.Exam.destroy({
      where: {
        id: data.id,
      },
    });
    return true;
  },

  //anser is string hash, userAnserCharacter is array of abcd
};
const getAttempsTime = async (subjectId, roomId, testId) => {
  const result = await db.History.findAll({
    attributes: ["id"],
    where: {
      subjectId: subjectId,
      testRoomId: roomId,
      testId: testId,
      timeAttemp: {
        [Op.not]: null,
      },
    },
  });

  return result.length + 1;
};
const checkScore = async (anser, userAnserCharacter) => {
  const userAnser = changeAnserToNumber(userAnserCharacter);
  let questionArray = anser.split("|");
  let correct = 0;
  questionArray = questionArray.filter((item) => item !== "");
  for (let index = 0; index < questionArray.length; index++) {
    anserArr = questionArray[index].split("-").filter((item) => item !== "");
    let { anserTimes, correctTimes } = await db.Question.findOne({
      attributes: ["anserTimes", "correctTimes"],
      where: {
        id: anserArr[0],
      },
    });
    anserTimes++;
    if (anserArr[Number(userAnser[index]) + 1] === "0") {
      correct++;
      correctTimes++;
    }
    await db.Question.update(
      {
        anserTimes,
        correctTimes,
      },
      {
        where: {
          id: anserArr[0],
        },
      }
    );
  }
  return { correct, total: questionArray.length };
};
const changeAnserToNumber = (userAnserArr) => {
  const numberArr = [];
  for (let index = 0; index < userAnserArr.length; index++) {
    switch (userAnserArr[index]) {
      case "a":
        numberArr.push("0");
        break;
      case "b":
        numberArr.push("1");
        break;
      case "c":
        numberArr.push("2");
        break;
      case "d":
        numberArr.push("3");
        break;

      default:
        numberArr.push("null");
        break;
    }
  }
  return numberArr;
};
const getExplain = async (anser) => {
  let explain = [];
  let questionArray = anser.split("|");
  questionArray = questionArray.filter((item) => item !== "");
  for (let index = 0; index < questionArray.length; index++) {
    const res = await db.Question.findOne({
      attributes: ["explain"],
      where: {
        id: questionArray[index].split("-")[0],
      },
    });
    explain.push(res.dataValues.explain);
  }
  return explain;
};

module.exports = examSevices;
