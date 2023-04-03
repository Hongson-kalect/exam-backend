"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TestRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TestRoom.init(
    {
      name: DataTypes.STRING,
      subjectId: DataTypes.INTEGER,
      testId: DataTypes.STRING,
      limitTime: DataTypes.STRING,
      time: DataTypes.STRING,
      day: DataTypes.STRING,
      allowSeeResult: DataTypes.BOOLEAN,
      allowSeeExplane: DataTypes.BOOLEAN,
      allowSeeScore: DataTypes.BOOLEAN,
      freeTest: DataTypes.BOOLEAN,
      maxAttemps: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TestRoom",
    }
  );
  return TestRoom;
};
