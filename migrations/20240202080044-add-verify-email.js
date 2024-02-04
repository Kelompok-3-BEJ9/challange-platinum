'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "token_verify", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "verify", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "token_verify");
    await queryInterface.removeColumn("Users", "verify");
  },
};

