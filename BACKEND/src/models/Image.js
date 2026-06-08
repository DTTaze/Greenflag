"use strict";
const { Model } = require("sequelize");
const { IMAGE_REFERENCE_TYPES } = require("../constants/imageTypes");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {}
  }
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reference_type: {
        type: DataTypes.ENUM(...Object.values(IMAGE_REFERENCE_TYPES)),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
    },
  );

  return Image;
};
