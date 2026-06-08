"use strict";
const { Model } = require("sequelize");

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
        type: DataTypes.ENUM(
          "ready_to_pick", // Chờ lấy hàng
          "picking", // Đang lấy hàng
          "money_collect_picking", // Đang tương tác với người gửi
          "picked", // Lấy hàng thành công
          "storing", // Nhập kho
          "transporting", // Đang trung chuyển
          "sorting", // Đang phân loại
          "delivering", // Đang giao hàng
          "delivered", // Giao hàng thành công
          "money_collect_delivering", // Đang tương tác với người nhận
          "delivery_fail", // Giao hàng không thành công
          "waiting_to_return", // Chờ xác nhận giao lại
          "return", // Chuyển hoàn
          "return_transporting", // Đang trung chuyển hàng hoàn
          "return_sorting", // Đang phân loại hàng hoàn
          "returning", // Đang hoàn hàng
          "return_fail", // Hoàn hàng không thành công
          "returned", // Hoàn hàng thành công
          "cancel", // Đơn huỷ
          "exception", // Hàng ngoại lệ
          "lost", // Hàng thất lạc
          "damage", // Hàng hư hỏng
        ),
        allowNull: false,
        defaultValue: "ready_to_pick",
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
