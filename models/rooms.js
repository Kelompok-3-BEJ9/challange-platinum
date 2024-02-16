'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDate } = require('../utils/date');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rooms.belongsToMany(models.Users,{
        through: models.Conversations,
        foreignKey: "room_id",
        as: "users"
      })
    }
  }
  Rooms.init({
    created_at: DataTypes.STRING,
    updated_at: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rooms',
    timestamps: false,
    hooks: {
      beforeCreate: (rooms, options) => {
        rooms.created_at = getFormattedDate();
        rooms.updated_at = getFormattedDate();
        
      },
      beforeUpdate: (rooms, options) => {
        rooms.updated_at = getFormattedDate();
      },
    },
  });
  return Rooms;
};