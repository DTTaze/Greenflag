"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coin extends Model {
    static associate(models) {
      Coin.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        as: "user",
      });
    }
  }

  Coin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Coin",
      tableName: "coins",
    },
  );
  return Coin;
};
