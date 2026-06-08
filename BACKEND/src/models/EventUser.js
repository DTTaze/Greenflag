"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EventUser extends Model {
    static associate(models) {
      EventUser.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      EventUser.belongsTo(models.Event, {
        foreignKey: "event_id",
        onDelete: "CASCADE",
      });
    }
  }

  EventUser.init(
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
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "EventUser",
      tableName: "event_users",
    },
  );

  return EventUser;
};
