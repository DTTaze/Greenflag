"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskUser extends Model {
    static associate(models) {
      TaskUser.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      TaskUser.belongsTo(models.Task, {
        foreignKey: "task_id",
        as: "tasks",
        onDelete: "CASCADE",
      });
    }
  }

  TaskUser.init(
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
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
      },
      progress_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TaskUser",
      tableName: "task_users",
    },
  );

  return TaskUser;
};
