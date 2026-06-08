"use strict";
const { Model } = require("sequelize");
const { CARRIER_TYPES } = require("../constants/carriers");

module.exports = (sequelize, DataTypes) => {
  class DeliveryAccount extends Model {
    static associate(models) {
      DeliveryAccount.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      DeliveryAccount.hasMany(models.DeliveryOrder, {
        foreignKey: "delivery_account_id",
        onDelete: "CASCADE",
      });
    }
  }

  DeliveryAccount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      carrier: {
        type: DataTypes.ENUM(...Object.values(CARRIER_TYPES)),
        allowNull: false,
        defaultValue: CARRIER_TYPES.GHN,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "DeliveryAccount",
      tableName: "delivery_accounts",
    },
  );

  return DeliveryAccount;
};
