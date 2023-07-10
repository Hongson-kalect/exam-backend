const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const { checkValidUser } = require("../ultis/function");
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
      subjectId: Number(data.subjectId) || 0,
    });
    if (result) return true;
    else return false;
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
          id: Number(data.id) || 0,
        },
      }
    );
    if (result) return true;
    else return false;
  },
  delQuestion: async (data) => {
    const result = await db.Question.destroy({
      where: {
        id: Number(data.id) || 0,
      },
    });
    return true;
  },
  getQuestionType: async (data) => {
    console.log(data.subjectId)
    const result = await db.Question.findAll({
      attributes: ["type"],
      where:{
        subjectId: data.subjectId
      },
      group: ["type"],
    });
    console.log('result',result)
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
                id: Number(data.input) || 1,
                question: { [Op.like]: `%${data.input || ""}%` },
                explain: { [Op.like]: `%${data.input || ""}%` },
              },
            },
            {
              [Op.or]: data.type
                ? {
                    type: {
                      [Op.like]: `%${data.type || ""}%`,
                    },
                  }
                : [
                    {
                      type: {
                        [Op.not]: null,
                      },
                    },
                    {
                      type: {
                        [Op.is]: null,
                      },
                    },
                  ],
            },
            {
              [Op.or]: data.level
                ? {
                    type: {
                      [Op.like]: `%${data.level || ""}%`,
                    },
                  }
                : [
                    {
                      type: {
                        [Op.not]: null,
                      },
                    },
                    {
                      type: {
                        [Op.is]: null,
                      },
                    },
                  ],
            },
            {
              subjectId: data.subjectId,
            },
          ],
        },
        order: [["id", "ASC"]],
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
