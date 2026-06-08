"use strict";
const { Model } = require("sequelize");
const { RECEIVER_ACCOUNT_TYPE } = require("../constants/receiverType");

module.exports = (sequelize, DataTypes) => {
  class ReceiverInformation extends Model {
    static associate(models) {
      ReceiverInformation.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      ReceiverInformation.hasMany(models.Transaction, {
        foreignKey: "receiver_information_id",
        onDelete: "CASCADE",
      });
    }
  }

  ReceiverInformation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      to_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to_address: {
        type: DataTypes.TEXT, //106 nguyen van dau
        allowNull: false,
      },
      //to_ward_name,to_district_name,to_province_name do ben ghn cần
      to_ward_name: {
        type: DataTypes.STRING, //p7
        allowNull: false,
      },
      to_district_name: {
        type: DataTypes.STRING, //binh thanh
        allowNull: false,
      },
      to_province_name: {
        type: DataTypes.STRING, //tp hcm
        allowNull: false,
      },
      account_type: {
        type: DataTypes.ENUM(...Object.values(RECEIVER_ACCOUNT_TYPE)),
        allowNull: false,
        defaultValue: RECEIVER_ACCOUNT_TYPE.HOME,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ReceiverInformation",
      tableName: "receiver_informations",
    },
  );

  return ReceiverInformation;
};
