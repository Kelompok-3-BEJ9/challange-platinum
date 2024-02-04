"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Orders",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          references: {
            model: "Users",
            key: "id",
          },
          type: Sequelize.INTEGER,
          onDelete: "SET NULL",
        },
        total_order_price: {
          type: Sequelize.DECIMAL,
        },
        status_order: {
          type: Sequelize.STRING,
        },
        date_order_placed: {
          type: Sequelize.STRING,
        },
        date_order_paid: {
          type: Sequelize.STRING,
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
