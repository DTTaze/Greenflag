"use strict";
const { Model } = require("sequelize");
const {
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
} = require("../constants/productStatus");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, {
        foreignKey: "seller_id",
        as: "seller",
        onDelete: "CASCADE",
      });
    }
  }

  Product.init(
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
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      category: {
        type: DataTypes.ENUM(...Object.values(PRODUCT_CATEGORY)),
        allowNull: false,
      },
      product_status: {
        type: DataTypes.ENUM(...Object.values(PRODUCT_CONDITION)),
        allowNull: false,
        defaultValue: PRODUCT_CONDITION.NEW,
      },
      post_status: {
        type: DataTypes.ENUM(...Object.values(PRODUCT_POST_STATUS)),
        allowNull: false,
        defaultValue: PRODUCT_POST_STATUS.PENDING,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    },
  );

  return Product;
};
