"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: "buyer_id",
        as: "buyer",
        onDelete: "CASCADE",
      });
      Transaction.belongsTo(models.User, {
        foreignKey: "seller_id",
        as: "seller",
        onDelete: "CASCADE",
      });
      Transaction.belongsTo(models.ReceiverInformation, {
        foreignKey: "receiver_information_id",
        as: "receiver_information",
        onDelete: "CASCADE",
      });
      Transaction.belongsTo(models.Item, {
        foreignKey: "item_id",
        as: "item",
        onDelete: "CASCADE",
      });
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      public_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      receiver_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "receiver_informations",
          key: "id",
        },
      },
      buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "items",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      item_snapshot: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      status: {
        type: DataTypes.ENUM("accepted", "rejected", "pending", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
    },
  );

  return Transaction;
};
