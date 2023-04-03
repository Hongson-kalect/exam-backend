"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question.init(
    {
      subjectId: DataTypes.INTEGER,
      question: DataTypes.TEXT,
      type: DataTypes.STRING,
      level: DataTypes.STRING,
      anser: DataTypes.TEXT,
      explain: DataTypes.TEXT,
      anserTimes: DataTypes.INTEGER,
      correctTimes: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
