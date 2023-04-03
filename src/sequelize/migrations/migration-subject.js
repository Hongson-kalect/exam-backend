"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subjects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      hash: {
        type: Sequelize.STRING,
      },
      member: {
        type: Sequelize.TEXT,
      },
      host: {
        type: Sequelize.STRING,
      },
      deputy: {
        type: Sequelize.TEXT,
      },
      allowSeeQuestion: {
        type: Sequelize.BOOLEAN,
      },
      allowSeeTest: {
        type: Sequelize.BOOLEAN,
      },

      avatar: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Subjects");
  },
};
