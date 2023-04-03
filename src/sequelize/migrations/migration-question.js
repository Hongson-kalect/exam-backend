"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subjectId: {
        type: Sequelize.INTEGER,
      },
      question: {
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.STRING,
      },
      anser: {
        type: Sequelize.TEXT,
      },

      explain: {
        type: Sequelize.TEXT,
      },
      anserTimes: {
        type: Sequelize.INTEGER,
      },
      correctTimes: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Questions");
  },
};
