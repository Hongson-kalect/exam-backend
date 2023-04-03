"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subject.init(
    {
      name: DataTypes.STRING,
      hash: DataTypes.STRING,
      member: DataTypes.TEXT,
      host: DataTypes.STRING,
      deputy: DataTypes.TEXT,
      allowSeeQuestion: DataTypes.BOOLEAN,
      allowSeeTest: DataTypes.BOOLEAN,
      avatar: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Subject",
    }
  );
  return Subject;
};
