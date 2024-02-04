'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Items",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        item_name: {
          type: Sequelize.STRING,
        },
        item_image: {
          type: Sequelize.STRING,
        },
        item_description: {
          type: Sequelize.TEXT,
        },
        item_stock: {
          type: Sequelize.INTEGER,
        },
        item_price: {
          type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable('Items');
  }
};