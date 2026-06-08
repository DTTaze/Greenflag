"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskType extends Model {
    static associate(models) {
      TaskType.belongsTo(models.Task, { foreignKey: "task_id" });

      TaskType.belongsTo(models.Type, { foreignKey: "type_id" });
    }
  }

  TaskType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "types",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "TaskType",
      tableName: "task_types",
    },
  );

  return TaskType;
};
