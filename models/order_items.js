'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order_Items.init(
    {
      order_id: {
        references: {
          model: "Order",
          key: "id",
        },
        type: DataTypes.UUID,
        onDelete: "CASCADE",
        defaultValue: DataTypes.UUIDV4,
      },
      item_id: {
        references: {
          model: "Items",
          key: "id",
        },
        type: DataTypes.INTEGER,
        onDelete: "SET NULL",
      },
      quantity: DataTypes.INTEGER,
      total_amount: DataTypes.DECIMAL,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Order_Items",
    }
  );
  return Order_Items;
};