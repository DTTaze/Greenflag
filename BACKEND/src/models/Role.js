"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: "role_id",
        otherKey: "permission_id",
        as: "permissions",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
    },
  );
  return Role;
};
