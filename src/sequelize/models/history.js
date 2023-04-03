"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  History.init(
    {
      userId: DataTypes.STRING,
      subjectId: DataTypes.INTEGER,
      testRoomId: DataTypes.INTEGER,
      testId: DataTypes.INTEGER,
      userAnser: DataTypes.TEXT,
      timeAttemp: DataTypes.INTEGER,
      submited: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
