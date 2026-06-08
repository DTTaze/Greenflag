"use strict";
const { Model } = require("sequelize");
const { DELIVERY_ORDER_STATUS } = require("../constants/deliveryStatus");

module.exports = (sequelize, DataTypes) => {
  class DeliveryOrder extends Model {
    static associate(models) {
      DeliveryOrder.belongsTo(models.User, {
        foreignKey: "seller_id",
        onDelete: "CASCADE",
      });
      DeliveryOrder.belongsTo(models.User, {
        foreignKey: "buyer_id",
        onDelete: "CASCADE",
      });
      DeliveryOrder.belongsTo(models.DeliveryAccount, {
        foreignKey: "delivery_account_id",
        as: "delivery_account",
        onDelete: "CASCADE",
      });
    }
  }

  DeliveryOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      delivery_account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "delivery_accounts",
          key: "id",
        },
      },
      order_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DELIVERY_ORDER_STATUS)),
        allowNull: false,
        defaultValue: DELIVERY_ORDER_STATUS.READY_TO_PICK,
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_printed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cod_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_type_id: {
        type: DataTypes.INTEGER, //1 ng gui, 2 ng nhan
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      item_snapshot: {
        type: DataTypes.JSON,
        allowNull: null,
      },
    },
    {
      sequelize,
      modelName: "DeliveryOrder",
      tableName: "delivery_orders",
    },
  );

  return DeliveryOrder;
};
