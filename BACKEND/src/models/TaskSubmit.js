"use strict";
const { Model } = require("sequelize");
const { TASK_SUBMIT_STATUS } = require("../constants/taskStatus");

module.exports = (sequelize, DataTypes) => {
  class TaskSubmit extends Model {
    static associate(models) {
      TaskSubmit.belongsTo(models.TaskUser, {
        foreignKey: "task_user_id",
        as: "task_user",
        onDelete: "CASCADE",
      });
      TaskSubmit.hasMany(models.Image, {
        foreignKey: "reference_id",
        as: "images",
        constraints: false,
      });
    }
  }

  TaskSubmit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      task_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "task_users",
          key: "id",
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(TASK_SUBMIT_STATUS)),
        defaultValue: TASK_SUBMIT_STATUS.PENDING,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "TaskSubmit",
      tableName: "task_submits",
    },
  );

  return TaskSubmit;
};
