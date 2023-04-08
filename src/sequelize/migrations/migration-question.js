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
        allowNull: false,

        type: Sequelize.STRING,
      },
      level: {
        allowNull: false,

        type: Sequelize.STRING,
      },
      anser: {
        type: Sequelize.TEXT,
      },

      explain: {
        allowNull: false,

        type: Sequelize.TEXT,
      },
      anserTimes: {
        allowNull: false,

        type: Sequelize.INTEGER,
      },
      correctTimes: {
        allowNull: false,

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
