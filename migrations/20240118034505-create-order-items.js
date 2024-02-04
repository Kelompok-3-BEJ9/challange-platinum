'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Order_Items",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        order_id: {
          references: {
            model: "Orders",
            key: "id",
          },
          type: Sequelize.UUID,
          onDelete: "CASCADE",
          defaultValue: Sequelize.UUIDV4,
        },
        item_id: {
          references: {
            model: "Items",
            key: "id",
          },
          type: Sequelize.INTEGER,
          onDelete: "SET NULL",
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        total_amount: {
          type: Sequelize.DECIMAL,
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order_Items');
  }
};