"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TestRooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      subjectId: {
        type: Sequelize.INTEGER,
      },
      testId: {
        type: Sequelize.STRING,
      },
      limitTime: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.STRING,
      },
      day: {
        type: Sequelize.STRING,
      },
      allowSeeResult: {
        type: Sequelize.BOOLEAN,
      },
      allowSeeExplane: {
        type: Sequelize.BOOLEAN,
      },
      allowSeeScore: {
        type: Sequelize.BOOLEAN,
      },
      freeTest: {
        type: Sequelize.BOOLEAN,
      },
      maxAttemps: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("TestRooms");
  },
};
