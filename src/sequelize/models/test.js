"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Test.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      question: DataTypes.TEXT,
      anserTimes: DataTypes.INTEGER,
      average: DataTypes.FLOAT,
      subjectId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Test",
    }
  );
  return Test;
};
