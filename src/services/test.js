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
const testSevices = {
  getTest: async (data) => {
    console.log(data);
    if (await checkValidUser(data.userId, data.subjectId)) {
      if (data.id) {
        const res = await db.Test.findOne({
          where: { id: Number(data.id) || 0 },
        });
        return res;
      }
      const result = await db.Test.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: {
                id: Number(data.input) || 0,
                code: { [Op.like]: `%${data.input}%` || "" },
                name: { [Op.like]: `%${data.input}%` || "" },
                description: { [Op.like]: `%${data.input}%` || "" },
              },
            },
            {
              subjectId: Number(data.subjectId) || 0,
            },
          ],
        },
      });
      return result;
    } else return false;
  },
  add: async (data) => {
    console.log(data);
    let question = "";
    for (i = 0; i < data.questions.length; i++) {
      if (data.questions[i] != "") {
        const questionData = await questionService.getQuestion({
          id: Number(data.questions[i]) || 0,
          userId: data.userId,
          subjectId: data.subjectId,
        });
        let anserArr = questionData.anser.split("|");
        anserArr = anserArr.filter((anser) => anser != "");
        const arr = makeArray(anserArr, 4);
        const sufferArr = shuffleArray(arr);
        sufferArr;

        question += data.questions[i] + "-" + sufferArr.join("-") + "|";
      }
    }
    let questions = shuffleArray(question.split("|"));
    questions = questions.filter((item) => item != "");
    question = questions.join("|");
    const result = await db.Test.create({
      code: data.code,
      name: data.name,
      question: question,
      description: data.description,
      subjectId: Number(data.subjectId) || 0,
    });
    if (result) return true;
    else return false;
  },

  editTest: async (data) => {
    let question = "";
    for (i = 0; i < data.questions.length; i++) {
      if (data.questions[i] != "") {
        const questionData = await questionService.getQuestion({
          id: number(data.questions[i]) || 0,
          subjectId: data.subjectId,
          userId: data.userId,
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
    const result = await db.Test.update(
      {
        code: data.code,
        name: data.name,
        question: question,
        description: data.description,
        // subjectId: data.subjectId,
      },
      {
        where: {
          id: Number(data.id) || 0,
        },
      }
    );
    if (result) return true;
    else return false;
  },
  delTest: async (data) => {
    const result = await db.Test.destroy({
      where: {
        id: Number(data.id) || 0,
      },
    });
    return true;
  },
  getTestType: async (data) => {
    const result = await db.Test.findAll({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },
  getTestBySubject: async (data) => {
    console.log("qq");
    const result = await db.Test.findAll({
      attributes: ["id", "code", "name"],
      where: {
        subjectId: Number(data.subjectId) || 0,
      },
    });
    return result;
  },

  addTestType: async (data) => {
    const result = await db.Test.create({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },
};
module.exports = testSevices;
