"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.hasMany(models.TaskType, {
        foreignKey: "task_id",
        onDelete: "CASCADE",
      });
      Task.belongsTo(models.User, {
        foreignKey: "creator_id",
        onDelete: "CASCADE",
      });
    }
  }

  Task.init(
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
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM("public", "private"),
        allowNull: false,
        defaultValue: "public",
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
    },
  );

  return Task;
};
