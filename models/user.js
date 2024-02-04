'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDate } = require('../utils/date');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasOne(models.User_Details, {
        foreignKey: "user_id", // Ini mengacu ke kolom user_id di table User_details
        sourceKey: "id", // Ini mengacu ke kolom id di table Users
        as: "user_detail"
      });
    }
  }
  Users.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      created_at: {
        type: DataTypes.STRING,
      },
      updated_at: {
        type: DataTypes.STRING,
      },
      token_verify:{
        type: DataTypes.STRING
      },
      verify:{
        type: DataTypes.BOOLEAN
      }
    },
    {
      sequelize,
      modelName: "Users",
      timestamps: false,
      hooks: {
        beforeCreate: (user, options) => {
          user.created_at = getFormattedDate();
          user.updated_at = getFormattedDate();
          
        },
        beforeUpdate: (user, options) => {
          user.updated_at = getFormattedDate();
        },
      },
    }
  );
  return Users;
};