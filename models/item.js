'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDate } = require('../utils/date');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Items.belongsToMany(models.Order,{
        through: models.Order_Items,
        foreignKey: "item_id",
        as: "order_items"
      })
    }
  }
  Items.init(
    {
      item_name: DataTypes.STRING,
      item_image: DataTypes.STRING,
      item_description: DataTypes.TEXT,
      item_stock: DataTypes.INTEGER,
      item_price: DataTypes.DECIMAL,
      created_at: {
        type: DataTypes.STRING,
      },
      updated_at: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Items",
      timestamps: false,
      hooks: {
        beforeCreate: (item, options) => {
          item.created_at = getFormattedDate();
          item.updated_at = getFormattedDate();
        },
        beforeUpdate: (item, options) => {
          item.updated_at = getFormattedDate();
        },
      },
    }
  );
  return Items;
};