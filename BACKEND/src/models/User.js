"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Item, {
        foreignKey: "creator_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Task, {
        foreignKey: "creator_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Product, {
        foreignKey: "seller_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Transaction, {
        foreignKey: "buyer_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Transaction, {
        foreignKey: "seller_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Event, {
        foreignKey: "creator_id",
        onDelete: "CASCADE",
      });
      User.hasOne(models.Coin, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        as: "coins",
      });
      User.hasOne(models.Rank, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        as: "ranks",
      });
      User.hasMany(models.DeliveryAccount, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.DeliveryOrder, {
        foreignKey: "seller_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.DeliveryOrder, {
        foreignKey: "buyer_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.ReceiverInformation, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      User.belongsTo(models.Role, { foreignKey: "role_id", as: "roles" });
    }
  }

  User.init(
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
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        references: { model: "roles", key: "id" },
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      rank_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      last_completed_task: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );

  return User;
};
