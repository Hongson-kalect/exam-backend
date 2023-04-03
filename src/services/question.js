const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const { checkValidUser } = require("../ultis/function");
const { getEmailByToken } = require("./global");
const questionSevices = {
  add: async (data) => {
    let anser = "";
    for (i = 0; i < data.anser.length; i++) {
      if (data.anser[i] != "") {
        anser += data.anser[i] + "|";
      }
    }
    const result = await db.Question.create({
      type: data.type,
      level: data.level,
      question: data.question,
      anser: anser,
      explain: data.explain,
      subjectId: data.subjectId,
    });
    if (result) return true;
    else return false;
  },
  addAllQuestion: async (data) => {
    const res = await db.Question.findAll();
    return { status: 1, res };
  },
  editQuestion: async (data) => {
    let anser = "";
    for (i = 0; i < data.anser.length; i++) {
      if (data.anser[i] != "") {
        anser += data.anser[i] + "|";
      }
    }
    const result = await db.Question.update(
      {
        type: data.type,
        level: data.level,
        question: data.question,
        anser: anser,
        explain: data.explain,
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
  delQuestion: async (data) => {
    const result = await db.Question.destroy({
      where: {
        id: data.id,
      },
    });
    return true;
  },
  getQuestionType: async (data) => {
    const result = await db.Question.findAll({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },
  getQuestion: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      if (data.id) {
        const res = await db.Question.findOne({
          where: { id: data.id },
        });
        return res;
      }
      const result = await db.Question.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: {
                id: { [Op.like]: `%${data.input || ""}%` },
                question: { [Op.like]: `%${data.input || ""}%` },
                explain: { [Op.like]: `%${data.input || ""}%` },
              },
            },
            {
              type: {
                [Op.like]: `%${data.type || ""}%`,
              },
            },
            {
              level: {
                [Op.like]: `%${data.level || ""}%`,
              },
            },
            {
              subjectId: data.subjectId,
            },
          ],
        },
      });
      return result;
    } else {
      console.log("cis lum miuas");

      return false;
    }
  },
  addQuestionType: async (data) => {
    const result = await db.Question.create({
      attributes: ["type"],
      group: ["type"],
    });
    return result;
  },
};
module.exports = questionSevices;
