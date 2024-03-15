'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDate } = require('../utils/date');
module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversations.hasMany(models.Messages,{
        foreignKey: "conversation_id",
        as: "messages"
      })
    }
  }
  Conversations.init(
    {
      room_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Rooms",
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: DataTypes.STRING,
      },
      updated_at: {
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: "Conversations",
      timestamps: false,
      hooks: {
        beforeCreate: (conversation, options) => {
          conversation.created_at = getFormattedDate();
          conversation.updated_at = getFormattedDate();
        },
        beforeUpdate: (conversation, options) => {
          conversation.updated_at = getFormattedDate();
        },
      },
    }
  );
  return Conversations;
};