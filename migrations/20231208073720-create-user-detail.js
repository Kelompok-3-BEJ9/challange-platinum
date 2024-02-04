'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "User_Details",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          references: {
            model: "Users",
            key: "id",
          },
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        address: {
          type: Sequelize.STRING,
        },
        city: {
          type: Sequelize.STRING,
        },
        postal_code: {
          type: Sequelize.STRING,
        },
        country_code: {
          type: Sequelize.STRING,
        },
        created_at: {
          type: Sequelize.STRING,
        },
        updated_at: {
          type: Sequelize.STRING,
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User_Details');
  }
};