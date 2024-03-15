'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDate } = require('../utils/date');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Messages.belongsTo(models.Conversations,{
        foreignKey: "conversation_id",
        as: "conversation"
      })
    }
  }
  Messages.init(
    {
      conversation_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Conversations",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      message: DataTypes.TEXT,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Messages",
      timestamps: false,
      hooks: {
        beforeCreate: (message, options) => {
          message.created_at = getFormattedDate();
          message.updated_at = getFormattedDate();
        },
        beforeUpdate: (message, options) => {
          message.updated_at = getFormattedDate();
        },
      }
    }
  );
  return Messages;
};